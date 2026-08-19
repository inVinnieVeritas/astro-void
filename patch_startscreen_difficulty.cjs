const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

code = code.replace(
  "import { GameMode, ControlScheme } from '../types';",
  "import { GameMode, Difficulty, ControlScheme } from '../types';"
);

code = code.replace(
  "  gameMode: GameMode;",
  "  gameMode: GameMode;\n  difficulty: Difficulty;\n  onChangeDifficulty: (difficulty: Difficulty) => void;"
);

code = code.replace(
  "  gameMode,\n  onChangeGameMode,",
  "  gameMode,\n  onChangeGameMode,\n  difficulty,\n  onChangeDifficulty,"
);

fs.writeFileSync('src/components/StartScreen.tsx', code);
