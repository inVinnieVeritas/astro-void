const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

const target = "export type GameMode = 'classic' | 'survival' | 'zen' | 'boss_rush' | 'wave_10_boss';";
const repl = "export type GameMode = 'classic' | 'survival' | 'zen' | 'boss_rush' | 'wave_10_boss' | 'wave_15_boss';";

if (code.includes(target)) {
  code = code.replace(target, repl);
  fs.writeFileSync('src/types.ts', code);
  console.log('types.ts patched');
}
