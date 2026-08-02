const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetElse = `      } else if (ufo.type === 'swarmer') {
        if (Math.random() < 0.4) spawnCollectible(ufo.x, ufo.y, 'triple');
        addFloatingText(ufo.x, ufo.y - 18, \`+\${points} SWARMER CLEARED!\`, '#38bdf8', 16);
      } else {
        if (Math.random() < 0.6) spawnCollectible(ufo.x, ufo.y, 'golden');
        addFloatingText(ufo.x, ufo.y - 20, \`+\${points} SCOUT DESTROYED!\`, '#38bdf8', 18);
      }`;

const replacementElse = `      } else if (ufo.type === 'swarmer') {
        if (Math.random() < 0.4) spawnCollectible(ufo.x, ufo.y, 'triple');
        addFloatingText(ufo.x, ufo.y - 18, \`+\${points} SWARMER CLEARED!\`, '#38bdf8', 16);
      } else if (ufo.type === 'triad_core') {
        // Handled in damage logic, just points here
        addFloatingText(ufo.x, ufo.y + 20, \`+\${points} CORE SECURED!\`, '#00ffff', 18);
      } else {
        if (Math.random() < 0.6) spawnCollectible(ufo.x, ufo.y, 'golden');
        addFloatingText(ufo.x, ufo.y - 20, \`+\${points} SCOUT DESTROYED!\`, '#38bdf8', 18);
      }`;

if (code.includes(targetElse)) {
  code = code.replace(targetElse, replacementElse);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully patched else block in destroyUfo.');
} else {
  console.log('Else target not found!');
}
