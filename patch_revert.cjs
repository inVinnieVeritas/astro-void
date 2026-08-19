const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

// Revert bossAttackRate completely to avoid any mistakes with timers that shrink windows
code = code.replace(/ -= timeFactor \* DIFFICULTY_CONFIG\[difficulty\]\.bossAttackRate;/g, " -= timeFactor;");

// Also revert += bossAttackRate
code = code.replace(/ \+ timeFactor \* DIFFICULTY_CONFIG\[difficulty\]\.bossAttackRate;/g, " + timeFactor;");

// Also there was: `timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;` in chargeTimer? Let's check regex:
// It was: `ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;`
// That's reverted by the above line.

// Same for fireRate if there was any `-=`? No, fireRate was only applied to `shootTimer +=`.
// So shootTimer is still affected by fireRate.

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
