const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

// I will globally replace "ufo.shootTimer += timeFactor;" with "ufo.shootTimer += timeFactor * DIFFICULTY_CONFIG[difficulty].fireRate;"
code = code.replace(/ufo\.shootTimer \+= timeFactor;/g, "ufo.shootTimer += timeFactor * DIFFICULTY_CONFIG[difficulty].fireRate;");

// I also need to make sure boss Attack rate is applied to boss state timers.
// Where is bossStateTimer decreased?
// "ufo.bossStateTimer -= timeFactor;"
code = code.replace(/ufo\.bossStateTimer -= timeFactor;/g, "ufo.bossStateTimer -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");

// Boss rapid fire or other timers?
// "ufo.rapidFireTimer = (ufo.rapidFireTimer || 0) + timeFactor;"
code = code.replace(/ufo\.rapidFireTimer = \(ufo\.rapidFireTimer \|\| 0\) \+ timeFactor;/g, "ufo.rapidFireTimer = (ufo.rapidFireTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");

// orbitalFiring, laserSweepFiring?
// If they decrease, e.g. `ufo.laserSweepTelegraph -= timeFactor;` 
// if they decrease faster, the telegraph is shorter. Which is harder!
code = code.replace(/ufo\.laserSweepTelegraph -= timeFactor;/g, "ufo.laserSweepTelegraph -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");
code = code.replace(/ufo\.laserSweepFiring -= timeFactor;/g, "ufo.laserSweepFiring -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");
code = code.replace(/ufo\.laserSweepRecovery -= timeFactor;/g, "ufo.laserSweepRecovery -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");

code = code.replace(/ufo\.orbitalWarning -= timeFactor;/g, "ufo.orbitalWarning -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");
code = code.replace(/ufo\.orbitalFiring -= timeFactor;/g, "ufo.orbitalFiring -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");

code = code.replace(/ufo\.gravityPulseActive -= timeFactor;/g, "ufo.gravityPulseActive -= timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");
code = code.replace(/ufo\.gravityPulseTimer = \(ufo\.gravityPulseTimer \|\| 0\) \+ timeFactor;/g, "ufo.gravityPulseTimer = (ufo.gravityPulseTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");

// "ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor;"
code = code.replace(/ufo\.chargeTimer = \(ufo\.chargeTimer \|\| 0\) \+ timeFactor;/g, "ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;");


fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
