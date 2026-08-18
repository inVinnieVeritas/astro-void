const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const restartGameForMode = useCallback\(\(mode: GameMode\) => \{/g,
  `const restartGameForMode = useCallback((mode: GameMode) => {\n    window.dispatchEvent(new CustomEvent('asteroids:reset-joystick'));`);
fs.writeFileSync('src/App.tsx', code);
