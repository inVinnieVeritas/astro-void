const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = `            vx: fromLeft ? 3.5 : -3.5,
            vy: (Math.random() - 0.5) * 1.0,
            radius: 18,
            speed: 3.5,`;

const replacement = `            vx: (fromLeft ? 3.5 : -3.5) * DIFFICULTY_CONFIG[difficulty].enemySpeed,
            vy: (Math.random() - 0.5) * 1.0 * DIFFICULTY_CONFIG[difficulty].enemySpeed,
            radius: 18,
            speed: 3.5 * DIFFICULTY_CONFIG[difficulty].enemySpeed,`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
