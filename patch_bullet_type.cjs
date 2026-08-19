const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const target = `  isLaser?: boolean;
  isMine?: boolean;`;

const replacement = `  isLaser?: boolean;
  laserHitTargets?: Set<string>;
  isMine?: boolean;`;

code = code.replace(target, replacement);

fs.writeFileSync('src/types.ts', code);
