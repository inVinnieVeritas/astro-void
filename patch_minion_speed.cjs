const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = `                const minion: UFO = {
                  id: 'minion-' + Math.random(),
                  x: spawnX,
                  y: spawnY,
                  vx: (Math.random() - 0.5) * 2.5,
                  vy: (Math.random() - 0.5) * 1.5,
                  radius: mType === 'swarmer' ? 14 : 20,
                  speed: 2.2,`;

const replacement = `                const minion: UFO = {
                  id: 'minion-' + Math.random(),
                  x: spawnX,
                  y: spawnY,
                  vx: ((Math.random() - 0.5) * 2.5) * DIFFICULTY_CONFIG[difficulty].enemySpeed,
                  vy: ((Math.random() - 0.5) * 1.5) * DIFFICULTY_CONFIG[difficulty].enemySpeed,
                  radius: mType === 'swarmer' ? 14 : 20,
                  speed: 2.2 * DIFFICULTY_CONFIG[difficulty].enemySpeed,`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
