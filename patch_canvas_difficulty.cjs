const fs = require('fs');
let code = fs.readFileSync('src/components/AsteroidsCanvas.tsx', 'utf8');

code = code.replace(
  "  GameMode,",
  "  GameMode,\n  Difficulty,"
);

code = code.replace(
  "  gameMode: GameMode;",
  "  gameMode: GameMode;\n  difficulty: Difficulty;"
);

code = code.replace(
  "  gameMode,\n  initialWave",
  "  gameMode,\n  difficulty,\n  initialWave"
);

fs.writeFileSync('src/components/AsteroidsCanvas.tsx', code);
