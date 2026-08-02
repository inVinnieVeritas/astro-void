const fs = require('fs');
let code = fs.readFileSync('dist/assets/index-CeeD0HTX.js', 'utf-8');
console.log("Index of sweep:", code.indexOf('sweep'));
