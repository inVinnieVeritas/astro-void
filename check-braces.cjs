const fs = require('fs');

let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');
const destroyMatch = code.match(/const destroyAsteroid = useCallback\(\(index: number, isRam: boolean = false\) => \{([\s\S]*?)const triggerEmp/);

if (destroyMatch) {
    const fn = destroyMatch[0];
    let balance = 0;
    for (let i = 0; i < fn.length; i++) {
        if (fn[i] === '{') balance++;
        if (fn[i] === '}') balance--;
    }
    console.log("Brace balance in destroyAsteroid:", balance);
}
