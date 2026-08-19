const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const targetMinion = `ufo.minionSpawnTimer = (ufo.minionSpawnTimer || 0) + timeFactor;`;
const replaceMinion = `ufo.minionSpawnTimer = (ufo.minionSpawnTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;`;

const targetSpiral = `ufo.spiralTimer = (ufo.spiralTimer || 0) + timeFactor;`;
const replaceSpiral = `ufo.spiralTimer = (ufo.spiralTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].bossAttackRate;`;

const targetCharge = `ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor;`;
// Only replace the non-boss chargeTimer which is still `timeFactor`
const replaceCharge = `ufo.chargeTimer = (ufo.chargeTimer || 0) + timeFactor * DIFFICULTY_CONFIG[difficulty].fireRate;`;

code = code.replace(targetMinion, replaceMinion);
code = code.replace(targetSpiral, replaceSpiral);
code = code.replace(targetCharge, replaceCharge);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
