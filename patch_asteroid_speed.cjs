const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = "    const baseSpeed = type === 'planetoid' ? (0.08 + Math.random() * 0.08) : (0.6 + Math.random() * 1.4);";
const replacement = "    const diff = DIFFICULTY_CONFIG[difficulty];\n    const baseSpeed = (type === 'planetoid' ? (0.08 + Math.random() * 0.08) : (0.6 + Math.random() * 1.4)) * diff.enemySpeed;";

code = code.replace(target, replacement);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
