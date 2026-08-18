const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetReturn = `    soundEngine.stopMusic();
    soundEngine.stopThrustSound();
    soundEngine.stopReverseSound();
    setGameKey((prev) => prev + 1);`;

const newReturn = `    soundEngine.stopMusic();
    soundEngine.stopThrustSound();
    soundEngine.stopReverseSound();
    soundEngine.stopUfoAlarm();
    soundEngine.resumeAll();
    setGameKey((prev) => prev + 1);`;

code = code.replace(targetReturn, newReturn);

const targetRender = `      {/* Main Asteroids Canvas Engine */}
      <AsteroidsCanvas`;

const newRender = `      {/* Main Asteroids Canvas Engine */}
      {gameStarted && (
        <AsteroidsCanvas`;

code = code.replace(targetRender, newRender);

const targetRenderEnd = `        onStatsRecord={handleStatsRecord}
        onUnlockAchievement={unlockAchievement}
      />`;

const newRenderEnd = `        onStatsRecord={handleStatsRecord}
        onUnlockAchievement={unlockAchievement}
      />
      )}`;

code = code.replace(targetRenderEnd, newRenderEnd);

fs.writeFileSync('src/App.tsx', code);
