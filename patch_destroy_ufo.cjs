const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');

const targetDestroyUfo = `    createBigExplosion(ufo.x, ufo.y);

    if (ufo.isBoss) {
      soundEngine.playSound('heavy_explode');`;

const replacementDestroyUfo = `    createBigExplosion(ufo.x, ufo.y);

    const isFinalTriad = ufo.type === 'triad_core' && ufosRef.current.filter(u => u.type === 'triad_core').length <= 1;
    const isBossDeath = (ufo.isBoss && ufo.type !== 'triad_core') || isFinalTriad;

    if (isBossDeath) {
      soundEngine.playSound('heavy_explode');`;

if (code.includes(targetDestroyUfo)) {
  code = code.replace(targetDestroyUfo, replacementDestroyUfo);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
  console.log('Successfully replaced destroyUfo logic.');
} else {
  console.log('destroyUfo target not found!');
}
