const fs = require('fs');

let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');
code = code.replace(/    \/\/ Score points/, '    }\n    // Score points');
fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
