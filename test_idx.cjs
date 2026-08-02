const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf-8');
const startIdx = code.indexOf('          // TRON Biomechanic Mainframe Core'); // using the new string to find where it was inserted
console.log(startIdx);
