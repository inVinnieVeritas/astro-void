const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add Difficulty import
code = code.replace(
  "import { GameMode, ControlScheme, HighScoreRecord, LifetimeStats, Achievement, RunStatsSnapshot } from './types';",
  "import { GameMode, Difficulty, ControlScheme, HighScoreRecord, LifetimeStats, Achievement, RunStatsSnapshot } from './types';"
);

// Add difficulty state
code = code.replace(
  "  const [gameMode, setGameMode] = useState<GameMode>('classic');",
  "  const [gameMode, setGameMode] = useState<GameMode>('classic');\n  const [difficulty, setDifficulty] = useState<Difficulty>('normal');"
);

// Pass to AsteroidsCanvas
code = code.replace(
  "        gameMode={gameMode}",
  "        gameMode={gameMode}\n        difficulty={difficulty}"
);

// Pass to StartScreen
code = code.replace(
  "          gameMode={gameMode}",
  "          gameMode={gameMode}\n          difficulty={difficulty}\n          onChangeDifficulty={setDifficulty}"
);

fs.writeFileSync('src/App.tsx', code);
