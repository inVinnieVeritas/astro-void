const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

const destroyAsteroidMatch = code.match(/const destroyAsteroid = useCallback\(\(index: number, isRam: boolean = false\) => \{([\s\S]*?)const wasFirstAsteroidDestroyed = state\.asteroidsDestroyed === 0;/);

if (destroyAsteroidMatch) {
    let body = destroyAsteroidMatch[1];
    
    // Disable close kill bonus for rams
    body = body.replace(/if \(ship && ship\.alive\) \{/, 'if (ship && ship.alive && !isRam) {');
    
    // Disable drops for rams
    body = body.replace(/\/\/ Special & Hazard asteroid powerup drops/, 'if (!isRam) {\n    // Special & Hazard asteroid powerup drops');
    body = body.replace(/\/\/ Score points/, '}\n\n    // Score points'); // close the if(!isRam) block just before score points

    code = code.replace(destroyAsteroidMatch[1], body);
    fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
    console.log("destroyAsteroid patched successfully");
} else {
    console.log("destroyAsteroid match failed");
}
