const fs = require('fs');
let code = fs.readFileSync('src/components/TouchControls.tsx', 'utf8');
code = code.replace(/};\s*window\.addEventListener\('pointerup'/g, '};\n\n    window.addEventListener(\'pointerup\'');
code = code.replace(/true\);\s*window\.addEventListener\('blur'/g, 'true\);\n    window.addEventListener(\'blur\'');
code = code.replace(/true\);\s*window\.removeEventListener\('blur'/g, 'true\);\n      window.removeEventListener(\'blur\'');
fs.writeFileSync('src/components/TouchControls.tsx', code);
