const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const targetRapid = `ufo.rapidFireTimer = (ufo.rapidFireTimer || 0) + timeFactor;`;
const replaceRapid = `ufo.rapidFireTimer = (ufo.rapidFireTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;`;

const targetCharge = `ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor;`;
const replaceCharge = `ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;`;

const targetPulse = `ufo.gravityPulseTimer = (ufo.gravityPulseTimer || 0) + timeFactor;`;
const replacePulse = `ufo.gravityPulseTimer = (ufo.gravityPulseTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;`;

code = code.replace(targetRapid, replaceRapid);
code = code.replace(targetCharge, replaceCharge);
code = code.replace(targetPulse, replacePulse);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
