const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = `const DIFFICULTY_CONFIG: Record<Difficulty, { enemySpeed: number; fireRate: number; projectileSpeed: number; bossAttackRate: number }> = {
  easy: { enemySpeed: 0.85, fireRate: 0.85, projectileSpeed: 0.85, bossAttackRate: 0.85 },
  normal: { enemySpeed: 1.0, fireRate: 1.0, projectileSpeed: 1.0, bossAttackRate: 1.0 },
  hard: { enemySpeed: 1.15, fireRate: 1.15, projectileSpeed: 1.15, bossAttackRate: 1.15 }
};`;

const replacement = `const DIFFICULTY_CONFIG: Record<Difficulty, { enemySpeed: number; fireRate: number; projectileSpeed: number; bossAttackRate: number }> = {
  easy: { enemySpeed: 1.0, fireRate: 1.0, projectileSpeed: 1.0, bossAttackRate: 1.0 },
  normal: { enemySpeed: 1.10, fireRate: 1.20, projectileSpeed: 1.15, bossAttackRate: 1.20 },
  hard: { enemySpeed: 1.18, fireRate: 1.40, projectileSpeed: 1.25, bossAttackRate: 1.35 }
};`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
