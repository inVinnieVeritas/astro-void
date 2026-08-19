const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace("laserHitTargets?: Set<string>;", "laserLastHitFrame?: Map<string, number>;");
fs.writeFileSync('src/types.ts', code);
