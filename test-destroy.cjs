const fs = require('fs');
const code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const regex = /const destroyAsteroid = useCallback\(\(index: number, isRam: boolean = false\) => \{[\s\S]*?(?=asteroidsRef\.current\.splice)/;
const match = code.match(regex);
console.log(match ? match[0].substring(0, 1000) : "no match");
