const fs = require('fs');

let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

// Add shieldDropLockoutTimer to gameStateRef
code = code.replace(/consecutiveHits: 0,\n\s+gridArchitectContinueUsed: false/g, 
  'consecutiveHits: 0,\n    shieldDropLockoutTimer: 0,\n    gridArchitectContinueUsed: false');

// Add decrement
code = code.replace(/const timeFactor = pTimers\.timewarp > 0 \? 0\.25 : 1\.0;\n/g,
  'const timeFactor = pTimers.timewarp > 0 ? 0.25 : 1.0;\n\n      if (state.shieldDropLockoutTimer > 0) {\n        state.shieldDropLockoutTimer--;\n      }\n');

// Clear powerups on death
const deathPatch = `
    // Hull depleted (second hit) - destroy ship!
    ship.hullPower = 0;
    gameStateRef.current.lives--;
    callbacksRef.current.onLivesUpdate(gameStateRef.current.lives);

    // CHANGE: Active powerups are lost on player death
    powerupTimersRef.current = {
      tripleShot: 0,
      shield: 0,
      golden: 0,
      laser: 0,
      drone: 0,
      magnet: 0,
      timewarp: 0,
      repulsor: 0
    };
    callbacksRef.current.onActivePowerupsUpdate({ ...powerupTimersRef.current });
    dronesRef.current = []; // Remove active drone helpers
`;
code = code.replace(/\/\/ Hull depleted \(second hit\) - destroy ship!\n\s+ship\.hullPower = 0;\n\s+gameStateRef\.current\.lives--;\n\s+callbacksRef\.current\.onLivesUpdate\(gameStateRef\.current\.lives\);/g, deathPatch);

// Update spawnCollectible
const spawnPatch = `
  const spawnCollectible = useCallback((x: number, y: number, type: Collectible['type']) => {
    if (type === 'shield') {
      const isBossWave = gameStateRef.current.wave % 5 === 0 && gameStateRef.current.wave > 0;
      if (!isBossWave) {
        if ((gameStateRef.current.shieldDropLockoutTimer || 0) > 0) return;
        if (collectiblesRef.current.some(c => c.type === 'shield')) return;
      }
    }

    collectiblesRef.current.push({`;
code = code.replace(/const spawnCollectible = useCallback\(\(x: number, y: number, type: Collectible\['type'\]\) => \{\n\s+collectiblesRef\.current\.push\(\{/g, spawnPatch);

// Update shield and golden pickup to trigger lockout
const shieldPickupPatch = `
            } else if (c.type === 'shield') {
              soundEngine.playSound('powerup');
              pTimers.shield = 720;
              addFloatingText(ship.x, ship.y - 30, 'FORCE SHIELD!', '#66aaff', 20);
              const isBossWave = state.wave % 5 === 0 && state.wave > 0;
              if (!isBossWave) state.shieldDropLockoutTimer = 1500;
`;
code = code.replace(/\} else if \(c\.type === 'shield'\) \{\n\s+soundEngine\.playSound\('powerup'\);\n\s+pTimers\.shield = 720;\n\s+addFloatingText\(ship\.x, ship\.y - 30, 'FORCE SHIELD!', '#66aaff', 20\);\n/g, shieldPickupPatch);

const goldenPickupPatch = `
            if (c.type === 'golden') {
              soundEngine.playSound('golden');
              pTimers.golden = 600;
              pTimers.shield = 600;
              pTimers.tripleShot = 600;
              triggerBigBanner('⚡ HYPER CRYSTAL ACTIVATED!', 'FORCE SHIELD + TRIPLE CANNON OVERDRIVE', '#ffd700', 'rgba(255, 215, 0, 0.9)', 90);
              const isBossWave = state.wave % 5 === 0 && state.wave > 0;
              if (!isBossWave) state.shieldDropLockoutTimer = 1500;
`;
code = code.replace(/if \(c\.type === 'golden'\) \{\n\s+soundEngine\.playSound\('golden'\);\n\s+pTimers\.golden = 600;\n\s+pTimers\.shield = 600;\n\s+pTimers\.tripleShot = 600;\n\s+triggerBigBanner\('⚡ HYPER CRYSTAL ACTIVATED!', 'FORCE SHIELD \+ TRIPLE CANNON OVERDRIVE', '#ffd700', 'rgba\(255, 215, 0, 0\.9\)', 90\);\n/g, goldenPickupPatch);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
