const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

const target = `export const StartScreen: React.FC<StartScreenProps> = ({
  gameMode,
  onChangeGameMode,
  onStartGame,
  isPaused,
  difficulty,
  onChangeDifficulty
}) => {`;

const replacement = `export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  gameMode,
  onChangeGameMode,
  highScore,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenChallenges,
  onOpenSettings,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  isPaused,
  difficulty,
  onChangeDifficulty
}) => {`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/StartScreen.tsx', code);
