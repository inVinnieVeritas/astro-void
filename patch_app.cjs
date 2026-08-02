const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/setWave\(gameMode === 'wave_10_boss' \? 10 : gameMode === 'boss_rush' \? 5 : 1\);/g, "setWave(gameMode === 'wave_15_boss' ? 15 : gameMode === 'wave_10_boss' ? 10 : gameMode === 'boss_rush' ? 5 : 1);");

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched');
