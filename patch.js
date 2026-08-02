const fs = require('fs');
let file = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const target = `                  if (isThroughGap) {
                    // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!
                    const dmg = b.isLaser ? 12 : 5;
                    ufo.health -= dmg;
                    state.shotsHit++;
                    createSmallExplosion(b.x, b.y, '#00ffff');
                    soundEngine.playSound('shield_hit');
                    if (!b.isLaser) {
                      bulletsRef.current.splice(i, 1);
                    }

                    if (ufo.health <= 0) {
                      destroyUfo(ufo, 10000);
                      break;
                    } else {
                      addFloatingText(ufo.x, ufo.y - 25, \`CRITICAL CORE HIT -\${dmg} HP\`, '#00ffff', 15);
                    }
                  } else {`;

const replacement = `                  if (isThroughGap) {
                    // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!
                    const dmg = b.isLaser ? 12 : 5;
                    ufo.health -= dmg;
                    state.shotsHit++;
                    createBigExplosion(b.x, b.y, '#00ffff');
                    soundEngine.playSound('heavy_explode');
                    if (!b.isLaser) {
                      bulletsRef.current.splice(i, 1);
                    }

                    if (ufo.health <= 0) {
                      destroyUfo(ufo, 10000);
                      break;
                    } else {
                      addFloatingText(ufo.x, ufo.y - 25, \`🎯 CRITICAL CORE HIT -\${dmg} HP\`, '#00ffff', 20);
                    }
                  } else {`;

if (file.includes(target)) {
  file = file.replace(target, replacement);
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', file);
  console.log("Success");
} else {
  console.log("Target not found");
}
