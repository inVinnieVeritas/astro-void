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

// try replacing line by line
let count = 0;
file = file.replace(/createSmallExplosion\(b\.x, b\.y, '#00ffff'\);[\s\S]*?soundEngine\.playSound\('shield_hit'\);/m, () => {
    count++;
    return `createBigExplosion(b.x, b.y, '#00ffff');\n                    soundEngine.playSound('heavy_explode');`;
});
file = file.replace(/CRITICAL CORE HIT -\$\{dmg\} HP\`, '#00ffff', 15\);/, () => {
    count++;
    return `🎯 CRITICAL CORE HIT -\${dmg} HP\`, '#00ffff', 20);`;
});

if (count > 0) {
  fs.writeFileSync('src/components/AsteroidsCanvas.tsx', file);
  console.log("Success, replaced " + count);
} else {
  console.log("Target not found");
}
