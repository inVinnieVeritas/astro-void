const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetSpawn = `    // BOSS WAVE MECHANIC: Triggers every 5 waves (Wave 5, 10, 15...)
    if (waveNum % 5 === 0) {
      asteroidsRef.current = [];
      ufosRef.current = [];
      ufoBulletsRef.current = [];

      const w = canvasRef.current?.width || window.innerWidth;
      const h = canvasRef.current?.height || window.innerHeight;
      const isCoreSeverance = waveNum % 10 === 0;
      const bossHp = isCoreSeverance ? 2500 + Math.floor(waveNum / 10) * 800 : 1500 + Math.floor(waveNum / 5) * 500;

      // Safe spawn: center-right horizontally (avoiding left HUD), upper part vertically
      const safeX = Math.max(w / 2, 400);

      const boss: UFO = {
        id: 'boss-' + Math.random(),
        x: safeX + (Math.random() - 0.5) * 60,
        y: isCoreSeverance ? h * 0.3 : 130, // Safely in the upper part of the screen
        vx: isCoreSeverance ? 1.0 : 1.8,
        vy: 0,
        radius: isCoreSeverance ? 90 : 110,
        speed: isCoreSeverance ? 1.0 : 1.8,
        shootTimer: 0,
        type: isCoreSeverance ? 'core_severance' : 'dreadnought',
        health: bossHp,
        maxHealth: bossHp,
        angle: 0,
        shieldAngle: 0,
        isBoss: true,
        bossPhase: 1,
        bossState: 'burst', // Start moving immediately
        bossStateTimer: 180,
        chargeTimer: 0,
        behaviorTimer: 0,
        gridSweepTelegraph: 0,
        gridSweepFiring: 0,
        gridSweepAngle: Math.PI / 2,
        laserChargeProgress: 0,
        laserFiringTimer: 0,
        laserTargetX: w / 2,
        laserTargetY: h,
        pulseTimer: 0
      };

      ufosRef.current = [boss];
      
      if (isCoreSeverance) {
         // Spawn 3 orbiting shield nodes
         for(let i=0; i<3; i++) {
            ufosRef.current.push({
               id: 'node-' + Math.random(),
               x: boss.x,
               y: boss.y,
               vx: 0,
               vy: 0,
               radius: 35,
               speed: 0,
               shootTimer: 0,
               type: 'shield_node',
               health: 600 + Math.floor(waveNum / 10) * 200,
               maxHealth: 600 + Math.floor(waveNum / 10) * 200,
               angle: 0,
               orbitAngle: (Math.PI * 2 / 3) * i,
               orbitRadius: 220,
               isBoss: false,
            });
         }
      }

      soundEngine.playUfoAlarm();

      if (isCoreSeverance) {
         triggerBigBanner(
            '⚠️ CRITICAL THREAT DETECTED ⚠️',
            'CORE SEVERANCE MAINFRAME INBOUND • DESTROY SHIELD NODES FIRST!',
            '#A371F7',
            'rgba(163, 113, 247, 0.95)',
            200
         );
      } else {
         triggerBigBanner(
            '⚠️ BOSS ENCOUNTER DETECTED ⚠️',
            bossEncounteredRef.current ? \`DREADNOUGHT MOTHERSHIP MK-\${Math.floor(waveNum / 5)} INBOUND • PREPARE FOR COMBAT\` : 'SHOOT THE ROTATING SHIELD GAP! • OVERHEAT = 3X DAMAGE!',
            bossEncounteredRef.current ? '#ff0055' : '#00ffff',
            bossEncounteredRef.current ? 'rgba(255, 0, 85, 0.95)' : 'rgba(0, 255, 255, 0.95)',
            bossEncounteredRef.current ? 150 : 260
         );
      }`;

const replacementSpawn = `    // BOSS WAVE MECHANIC: Triggers every 5 waves (Wave 5, 10, 15...)
    if (waveNum % 5 === 0) {
      asteroidsRef.current = [];
      ufosRef.current = [];
      ufoBulletsRef.current = [];

      const w = canvasRef.current?.width || window.innerWidth;
      const h = canvasRef.current?.height || window.innerHeight;
      
      const isTriadProtocol = waveNum % 15 === 0;
      const isCoreSeverance = !isTriadProtocol && waveNum % 10 === 0;
      const isDreadnought = !isTriadProtocol && !isCoreSeverance;

      // Safe spawn: center horizontally, upper part vertically
      const safeX = w / 2;

      soundEngine.playUfoAlarm();

      if (isTriadProtocol) {
         const cx = safeX;
         const cy = Math.max(h * 0.35, 250);
         const triadRadius = 220; // distance from center of formation
         const coreHp = 2000 + Math.floor(waveNum / 15) * 800;
         
         for (let i = 0; i < 3; i++) {
             ufosRef.current.push({
                 id: 'boss-triad-' + i,
                 x: cx + Math.cos(i * (Math.PI*2/3) - Math.PI/2) * triadRadius,
                 y: cy + Math.sin(i * (Math.PI*2/3) - Math.PI/2) * triadRadius,
                 vx: 0,
                 vy: 0,
                 radius: 55,
                 speed: 1.5,
                 shootTimer: i * 40,
                 type: 'triad_core',
                 health: coreHp,
                 maxHealth: coreHp,
                 angle: i * (Math.PI*2/3), // Used for formation positioning
                 shieldAngle: 0, // Used to track linking status (0 = linked to next, etc)
                 isBoss: true, // Mark all as boss to share health bar (logic will aggregate)
                 bossPhase: 1,
                 bossState: 'active',
                 behaviorTimer: 0,
                 pulseTimer: 0,
                 chargeTimer: 0
             });
         }
         
         triggerBigBanner(
            '⚠️ EXTREME THREAT DETECTED ⚠️',
            \`TRIAD PROTOCOL MK-\${Math.floor(waveNum / 15)} INBOUND • SEVER THE LINKS TO WEAKEN\`,
            '#00ffff',
            'rgba(0, 255, 255, 0.95)',
            200
         );
      } else {
         const bossHp = isCoreSeverance ? 2500 + Math.floor(waveNum / 10) * 800 : 1500 + Math.floor(waveNum / 5) * 500;
         
         const boss: UFO = {
            id: 'boss-' + Math.random(),
            x: safeX + (Math.random() - 0.5) * 60,
            y: isCoreSeverance ? h * 0.3 : 130, // Safely in the upper part of the screen
            vx: isCoreSeverance ? 1.0 : 1.8,
            vy: 0,
            radius: isCoreSeverance ? 90 : 110,
            speed: isCoreSeverance ? 1.0 : 1.8,
            shootTimer: 0,
            type: isCoreSeverance ? 'core_severance' : 'dreadnought',
            health: bossHp,
            maxHealth: bossHp,
            angle: 0,
            shieldAngle: 0,
            isBoss: true,
            bossPhase: 1,
            bossState: 'burst', // Start moving immediately
            bossStateTimer: 180,
            chargeTimer: 0,
            behaviorTimer: 0,
            gridSweepTelegraph: 0,
            gridSweepFiring: 0,
            gridSweepAngle: Math.PI / 2,
            laserChargeProgress: 0,
            laserFiringTimer: 0,
            laserTargetX: w / 2,
            laserTargetY: h,
            pulseTimer: 0
         };

         ufosRef.current = [boss];
         
         if (isCoreSeverance) {
            // Spawn 3 orbiting shield nodes
            for(let i=0; i<3; i++) {
               ufosRef.current.push({
                  id: 'node-' + Math.random(),
                  x: boss.x,
                  y: boss.y,
                  vx: 0,
                  vy: 0,
                  radius: 35,
                  speed: 0,
                  shootTimer: 0,
                  type: 'shield_node',
                  health: 600 + Math.floor(waveNum / 10) * 200,
                  maxHealth: 600 + Math.floor(waveNum / 10) * 200,
                  angle: 0,
                  orbitAngle: (Math.PI * 2 / 3) * i,
                  orbitRadius: 220,
                  isBoss: false,
               });
            }
         }

         if (isCoreSeverance) {
            triggerBigBanner(
               '⚠️ CRITICAL THREAT DETECTED ⚠️',
               'CORE SEVERANCE MAINFRAME INBOUND • DESTROY SHIELD NODES FIRST!',
               '#A371F7',
               'rgba(163, 113, 247, 0.95)',
               200
            );
         } else {
            triggerBigBanner(
               '⚠️ BOSS ENCOUNTER DETECTED ⚠️',
               bossEncounteredRef.current ? \`DREADNOUGHT MOTHERSHIP MK-\${Math.floor(waveNum / 5)} INBOUND • PREPARE FOR COMBAT\` : 'SHOOT THE ROTATING SHIELD GAP! • OVERHEAT = 3X DAMAGE!',
               bossEncounteredRef.current ? '#ff0055' : '#00ffff',
               bossEncounteredRef.current ? 'rgba(255, 0, 85, 0.95)' : 'rgba(0, 255, 255, 0.95)',
               bossEncounteredRef.current ? 150 : 260
            );
         }
      }`;

if (code.includes(targetSpawn)) {
  code = code.replace(targetSpawn, replacementSpawn);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced boss spawn logic.');
} else {
  console.log('Boss spawn target not found!');
}
