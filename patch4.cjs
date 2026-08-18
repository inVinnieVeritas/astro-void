const fs = require('fs');

let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

// Update to 2400 frames
code = code.replace(/state\.shieldDropLockoutTimer = 1500;/g, 'state.shieldDropLockoutTimer = 2400;');

// Update spawnCollectible to block both golden and shield
const newSpawn = `  const spawnCollectible = useCallback((x: number, y: number, type: Collectible['type']) => {
    if (type === 'shield' || type === 'golden') {
      const isBossWave = gameStateRef.current.wave % 5 === 0 && gameStateRef.current.wave > 0;
      if (!isBossWave) {
        if ((gameStateRef.current.shieldDropLockoutTimer || 0) > 0) return;
        if (collectiblesRef.current.some(c => c.type === 'shield' || c.type === 'golden')) return;
      }
    }`;
code = code.replace(/const spawnCollectible = useCallback\(\(x: number, y: number, type: Collectible\['type'\]\) => \{\n\s+if \(type === 'shield'\) \{\n\s+const isBossWave = gameStateRef\.current\.wave % 5 === 0 && gameStateRef\.current\.wave > 0;\n\s+if \(!isBossWave\) \{\n\s+if \(\(gameStateRef\.current\.shieldDropLockoutTimer \|\| 0\) > 0\) return;\n\s+if \(collectiblesRef\.current\.some\(c => c\.type === 'shield'\)\) return;\n\s+\}\n\s+\}/, newSpawn);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
