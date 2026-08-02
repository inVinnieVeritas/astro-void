const fs = require('fs');
let code = fs.readFileSync('dist/assets/index-CeeD0HTX.js', 'utf-8');
const searchString = "AI Mainframe Core";
console.log("Index of 'AI Mainframe Core':", code.indexOf(searchString));
