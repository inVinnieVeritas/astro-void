const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target1 = `            speed: 1.2,
            shootTimer: 0,`;

const replacement1 = `            speed: 1.2 * DIFFICULTY_CONFIG[difficulty].enemySpeed,
            shootTimer: 0,`;

code = code.replace(target1, replacement1);

const target2 = `            vx: isCoreSeverance ? 1.0 : 1.8,
            vy: 0,
            radius: (isCoreSeverance ? 90 : 110) * currentBossScale,bossScale: currentBossScale,
            speed: isCoreSeverance ? 1.0 : 1.8,`;

const replacement2 = `            vx: (isCoreSeverance ? 1.0 : 1.8) * DIFFICULTY_CONFIG[difficulty].enemySpeed,
            vy: 0,
            radius: (isCoreSeverance ? 90 : 110) * currentBossScale,bossScale: currentBossScale,
            speed: (isCoreSeverance ? 1.0 : 1.8) * DIFFICULTY_CONFIG[difficulty].enemySpeed,`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
