const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const handleGameOver = useCallback\(\n\s+\(finalScore.*?\) => \{/g,
  `const handleGameOver = useCallback(\n    (finalScore: number, finalWave: number, asteroidsCount: number, accuracy: number, maxCombo: number, ufosDestroyed: number, bossDamageDealt: number) => {\n      window.dispatchEvent(new CustomEvent('asteroids:reset-joystick'));`);

code = code.replace(/const returnToMissionSelect = useCallback\(\(\) => \{/g,
  `const returnToMissionSelect = useCallback(() => {\n    window.dispatchEvent(new CustomEvent('asteroids:reset-joystick'));`);

code = code.replace(/const handleStartGame = useCallback\(\n\s+\(initialMode.*?\) => \{/g,
  `const handleStartGame = useCallback(\n    (initialMode?: GameMode) => {\n      window.dispatchEvent(new CustomEvent('asteroids:reset-joystick'));`);

fs.writeFileSync('src/App.tsx', code);
