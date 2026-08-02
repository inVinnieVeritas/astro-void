const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf-8');

code = code.replace('className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"', 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"');
fs.writeFileSync('src/components/StartScreen.tsx', code);
console.log('grid-cols patched');
