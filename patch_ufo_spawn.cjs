const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target1 = `      const newUfo: UFO = {
        id: Math.random().toString(),
        x: spawnX,
        y: spawnY,
        vx: initialVx,
        vy: initialVy,
        radius,
        speed: fromLeft ? speed : -speed,`;

const replacement1 = `      const diff = DIFFICULTY_CONFIG[difficulty];
      const newUfo: UFO = {
        id: Math.random().toString(),
        x: spawnX,
        y: spawnY,
        vx: initialVx * diff.enemySpeed,
        vy: initialVy * diff.enemySpeed,
        radius,
        speed: (fromLeft ? speed : -speed) * diff.enemySpeed,`;

code = code.replace(target1, replacement1);

// Also need to scale swarmer speeds, let's see how swarmer is pushed.
const targetSwarmer = `        const swarmer: UFO = {
          id: Math.random().toString(),
          x: spawnX + (s - 1) * 22,
          y: spawnY + (Math.random() - 0.5) * 35,
          vx: fromLeft ? 2.8 : -2.8,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 14,
          speed: fromLeft ? 2.8 : -2.8,`;

const replacementSwarmer = `        const diff = DIFFICULTY_CONFIG[difficulty];
        const swarmer: UFO = {
          id: Math.random().toString(),
          x: spawnX + (s - 1) * 22,
          y: spawnY + (Math.random() - 0.5) * 35,
          vx: (fromLeft ? 2.8 : -2.8) * diff.enemySpeed,
          vy: ((Math.random() - 0.5) * 1.5) * diff.enemySpeed,
          radius: 14,
          speed: (fromLeft ? 2.8 : -2.8) * diff.enemySpeed,`;

code = code.replace(targetSwarmer, replacementSwarmer);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
