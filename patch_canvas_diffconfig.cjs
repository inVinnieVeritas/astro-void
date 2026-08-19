const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const config = `
const DIFFICULTY_CONFIG = {
  easy: { enemySpeed: 0.85, fireRate: 1.15, projectileSpeed: 0.85, bossAttackRate: 1.15 },
  normal: { enemySpeed: 1.0, fireRate: 1.0, projectileSpeed: 1.0, bossAttackRate: 1.0 },
  hard: { enemySpeed: 1.15, fireRate: 0.85, projectileSpeed: 1.15, bossAttackRate: 0.85 }
};
`;

code = code.replace(
  "const VIRTUAL_WIDTH = 1200;",
  config + "\nconst VIRTUAL_WIDTH = 1200;"
);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
