const fs = require('fs');
let code = fs.readFileSync('src/components/StartScreen.tsx', 'utf8');

const target = "export const StartScreen: React.FC<StartScreenProps> = ({";
const replacement = "export const StartScreen: React.FC<StartScreenProps> = ({\n  " +
  "// ...props\n" +
  "  gameMode,\n  onChangeGameMode,\n  onStartGame,\n  isPaused,\n  difficulty,\n  onChangeDifficulty\n}) => {\n" +
  "  const showBossTest = new URLSearchParams(window.location.search).get('bossTest') === '1';";

code = code.replace(
  /export const StartScreen: React\.FC<StartScreenProps> = \(\{[\s\S]*?\}\) => \{/,
  "export const StartScreen: React.FC<StartScreenProps> = ({\n  gameMode,\n  onChangeGameMode,\n  onStartGame,\n  isPaused,\n  difficulty,\n  onChangeDifficulty\n}) => {\n  const showBossTest = new URLSearchParams(window.location.search).get('bossTest') === '1';"
);

fs.writeFileSync('src/components/StartScreen.tsx', code);
