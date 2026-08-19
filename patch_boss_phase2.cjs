const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = "              ufo.speed = 3.2;";
const replacement = "              ufo.speed = 3.2 * DIFFICULTY_CONFIG[difficulty].enemySpeed;";

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
