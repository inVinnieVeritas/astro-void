const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const regex1 = /if \(b\.isLaser && b\.laserHitTargets\?\.has\(ufo\.id\)\) \{\s*continue;\s*\}/g;
const replacement1 = `if (b.isLaser) {
  const lastHit = b.laserLastHitFrame?.get(ufo.id) || 0;
  if (frameCountRef.current - lastHit < 4) {
    continue;
  }
}`;
code = code.replace(regex1, replacement1);

const regex2 = /if \(b\.isLaser\) \{\s*if \(!b\.laserHitTargets\) b\.laserHitTargets = new Set\(\);\s*b\.laserHitTargets\.add\(ufo\.id\);\s*\}/g;
const replacement2 = `if (b.isLaser) {
  if (!b.laserLastHitFrame) b.laserLastHitFrame = new Map();
  b.laserLastHitFrame.set(ufo.id, frameCountRef.current);
}`;
code = code.replace(regex2, replacement2);

// Also need to handle Dreadnought gap
// Let's do that manually since the regexes might not have caught it if it wasn't added yet
code = code.replace(
  "                    if (isThroughGap) {\n                      // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!\n                      const dmg = b.isLaser ? 3 : 5;",
  "                    if (isThroughGap) {\n                      // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!\n                      if (b.isLaser) {\n                        const lastHit = b.laserLastHitFrame?.get(ufo.id) || 0;\n                        if (frameCountRef.current - lastHit < 4) {\n                          continue;\n                        }\n                      }\n                      const dmg = b.isLaser ? 3 : 5;"
);

code = code.replace(
  "                      ufo.health -= dmg;\n                      state.bossDamageDealt += dmg;\n                      \n                      recordShotHit(b);",
  "                      ufo.health -= dmg;\n                      if (b.isLaser) {\n                        if (!b.laserLastHitFrame) b.laserLastHitFrame = new Map();\n                        b.laserLastHitFrame.set(ufo.id, frameCountRef.current);\n                      }\n                      state.bossDamageDealt += dmg;\n                      \n                      recordShotHit(b);"
);

// Also we need to do the same for shield_node logic inside the else block
// Since the previous shield_node replacement worked:
const regex3 = /if \(ufo\.type === 'shield_node' && b\.isLaser && b\.laserHitTargets\?\.has\(ufo\.id\)\) \{\s*continue;\s*\}/g;
const replacement3 = `if (ufo.type === 'shield_node' && b.isLaser) {
  const lastHit = b.laserLastHitFrame?.get(ufo.id) || 0;
  if (frameCountRef.current - lastHit < 4) {
    continue;
  }
}`;
code = code.replace(regex3, replacement3);

const regex4 = /if \(ufo\.type === 'shield_node' && b\.isLaser\) \{\s*if \(!b\.laserHitTargets\) b\.laserHitTargets = new Set\(\);\s*b\.laserHitTargets\.add\(ufo\.id\);\s*\}/g;
const replacement4 = `if (ufo.type === 'shield_node' && b.isLaser) {
  if (!b.laserLastHitFrame) b.laserLastHitFrame = new Map();
  b.laserLastHitFrame.set(ufo.id, frameCountRef.current);
}`;
code = code.replace(regex4, replacement4);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
