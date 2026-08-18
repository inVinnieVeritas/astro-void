const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const restartGameForMode = useCallback\(\n\s+\(\) => \{/g,
  `const restartGameForMode = useCallback(\n    () => {\n      window.dispatchEvent(new CustomEvent('asteroids:reset-joystick'));`);
code = code.replace(/const restartGameForMode = useCallback\(\(mode/g,
  `const restartGameForMode = useCallback((mode`);
fs.writeFileSync('src/App.tsx', code);
