const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = `          ub.x += ub.vx * timeFactor;
          ub.y += ub.vy * timeFactor;`;

const replacement = `          const diffProjSpeed = DIFFICULTY_CONFIG[difficulty].projectileSpeed;
          ub.x += ub.vx * timeFactor * diffProjSpeed;
          ub.y += ub.vy * timeFactor * diffProjSpeed;`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
