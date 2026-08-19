const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

// 1. Technoking
code = code.replace(
  "                    b.color = '#00ffff';\n                    continue;\n                  }\n\n                  // Weak spot check",
  "                    b.color = '#00ffff';\n                    continue;\n                  }\n\n                  if (b.isLaser && b.laserHitTargets?.has(ufo.id)) {\n                    continue;\n                  }\n\n                  // Weak spot check"
);

code = code.replace(
  "                  ufo.health -= dmg;\n                  state.bossDamageDealt += dmg;\n                  recordShotHit(b);",
  "                  ufo.health -= dmg;\n                  state.bossDamageDealt += dmg;\n                  recordShotHit(b);\n                  if (b.isLaser) {\n                    if (!b.laserHitTargets) b.laserHitTargets = new Set();\n                    b.laserHitTargets.add(ufo.id);\n                  }"
);

// 2. Core Severance
code = code.replace(
  "                  } else {\n                     // Vulnerable\n                     const dmg = (b.isLaser ? 25 : 10);\n                     ufo.health -= dmg;",
  "                  } else {\n                     // Vulnerable\n                     if (b.isLaser && b.laserHitTargets?.has(ufo.id)) {\n                        continue;\n                     }\n                     const dmg = (b.isLaser ? 25 : 10);\n                     ufo.health -= dmg;\n                     if (b.isLaser) {\n                        if (!b.laserHitTargets) b.laserHitTargets = new Set();\n                        b.laserHitTargets.add(ufo.id);\n                     }"
);

// 3. Dreadnought (Boss) Vulnerable Phase
code = code.replace(
  "                  if (dist < hitRadius + b.size) {\n                    const mouthCenterX = ufo.x;",
  "                  if (dist < hitRadius + b.size) {\n                    if (b.isLaser && b.laserHitTargets?.has(ufo.id)) {\n                      continue;\n                    }\n                    const mouthCenterX = ufo.x;"
);

code = code.replace(
  "                    ufo.health -= dmg;\n                    state.bossDamageDealt += dmg;\n                    recordShotHit(b);\n\n                    if (isMouthWeakHit) {",
  "                    ufo.health -= dmg;\n                    if (b.isLaser) {\n                      if (!b.laserHitTargets) b.laserHitTargets = new Set();\n                      b.laserHitTargets.add(ufo.id);\n                    }\n                    state.bossDamageDealt += dmg;\n                    recordShotHit(b);\n\n                    if (isMouthWeakHit) {"
);

// 4. Dreadnought (Boss) Shield Gap
code = code.replace(
  "                    if (isThroughGap) {\n                      // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!\n                      const dmg = b.isLaser ? 3 : 5;\n                      ufo.health -= dmg;\n                      state.bossDamageDealt += dmg;\n                      \n                      recordShotHit(b);",
  "                    if (isThroughGap) {\n                      // DIRECT CENTRAL CORE HIT THROUGH ROTATING SHIELD GAP!\n                      if (b.isLaser && b.laserHitTargets?.has(ufo.id)) {\n                        continue;\n                      }\n                      const dmg = b.isLaser ? 3 : 5;\n                      ufo.health -= dmg;\n                      if (b.isLaser) {\n                        if (!b.laserHitTargets) b.laserHitTargets = new Set();\n                        b.laserHitTargets.add(ufo.id);\n                      }\n                      state.bossDamageDealt += dmg;\n                      \n                      recordShotHit(b);"
);

// 5. Shield Node (in the `else` branch for non-bosses)
code = code.replace(
  "            } else {\n              if (dist < ufo.radius + b.size + 6) {\n                let dmg = b.isLaser ? 3 : 1;\n                if (ufo.type === 'shield_node') {\n                  dmg = b.isLaser ? 40 : 20; // Increased damage to nodes so they can be reasonably destroyed!\n                }\n\n                ufo.health -= dmg;\n                recordShotHit(b);",
  "            } else {\n              if (dist < ufo.radius + b.size + 6) {\n                if (ufo.type === 'shield_node' && b.isLaser && b.laserHitTargets?.has(ufo.id)) {\n                  continue;\n                }\n                let dmg = b.isLaser ? 3 : 1;\n                if (ufo.type === 'shield_node') {\n                  dmg = b.isLaser ? 40 : 20; // Increased damage to nodes so they can be reasonably destroyed!\n                }\n\n                ufo.health -= dmg;\n                if (ufo.type === 'shield_node' && b.isLaser) {\n                  if (!b.laserHitTargets) b.laserHitTargets = new Set();\n                  b.laserHitTargets.add(ufo.id);\n                }\n                recordShotHit(b);"
);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
