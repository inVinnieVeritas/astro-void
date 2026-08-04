import React, { useState, useEffect, useCallback } from 'react';
import { AsteroidsCanvas } from './components/AsteroidsCanvas';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { ChallengesModal } from './components/ChallengesModal';
import { GameOverModal } from './components/GameOverModal';
import { StartScreen } from './components/StartScreen';
import { soundEngine } from './audio/soundEngine';
import { GameMode, ControlScheme, HighScoreRecord, LifetimeStats, Achievement } from './types';

export default function App() {
  // Game Configuration State
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true, once: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);
  const [controlScheme, setControlScheme] = useState<ControlScheme>('classic');

  // Audio & Graphics
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [crtFilter, setCrtFilter] = useState(true);
  const [screenShake, setScreenShake] = useState(true);

  // Runtime Game State
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [lives, setLives] = useState(3);
  const [empCount, setEmpCount] = useState(1);
  const [empRechargeProgress, setEmpRechargeProgress] = useState(1);
  const [hyperspaceCooldown, setHyperspaceCooldown] = useState(0);
  const [hullPower, setHullPower] = useState(100);
  const [maxHullPower] = useState(100);
  const [activePowerups, setActivePowerups] = useState<any>({});
  const [isShipNearHud, setIsShipNearHud] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [gameOverStats, setGameOverStats] = useState({
    asteroidsDestroyed: 0,
    ufosDestroyed: 0,
    maxCombo: 0,
    bossDamageDealt: 0,
    accuracy: 0
  });
  const [gameKey, setGameKey] = useState(0); // For forcing canvas restart

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = window.document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    const doc = window.document as any;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      if (requestFullScreen) {
        requestFullScreen.call(docEl).catch((err: any) => console.warn(err));
      }
    } else {
      if (cancelFullScreen) {
        cancelFullScreen.call(doc);
      }
    }
  }, []);

  // Modal Dialog Visibility
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);

  // Challenges State & Persistence
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('asteroids_completed_challenges') || '[]');
    } catch {
      return [];
    }
  });

  const challengesList = [
    {
      id: 'wave_10',
      title: 'Void Cadet',
      description: 'Reach Wave 10 in Classic mode.',
      rewardText: 'Badge of Honor',
      completed: completedChallenges.includes('wave_10')
    },
    {
      id: 'purist',
      title: 'Purist',
      description: 'Reach Wave 10 in Classic mode without using an EMP bomb.',
      rewardText: 'Elite Pilot',
      completed: completedChallenges.includes('purist')
    },
    {
      id: 'chain_reaction',
      title: 'Chain Reaction',
      description: 'Achieve a 15x or higher combo streak.',
      rewardText: 'Combo Master',
      completed: completedChallenges.includes('chain_reaction')
    },
    {
      id: 'marksman',
      title: 'Marksman',
      description: 'Reach Wave 8 with 70%+ accuracy (min 50 shots fired).',
      rewardText: 'Sharp Shooter',
      completed: completedChallenges.includes('marksman')
    },
    {
      id: 'ufo_hunter',
      title: 'UFO Hunter',
      description: 'Destroy 3 or more alien UFOs in a single run.',
      rewardText: 'Alien Bane',
      completed: completedChallenges.includes('ufo_hunter')
    },
    {
      id: 'boss_veteran',
      title: 'Dreadnought Breaker',
      description: 'Deal 2,000+ total damage to boss / mothership vessels.',
      rewardText: 'Core Destroyer',
      completed: completedChallenges.includes('boss_veteran')
    },
    {
      id: 'survival_master',
      title: 'Survival Specialist',
      description: 'Reach Wave 8 in Survival mode.',
      rewardText: 'Endurance Legend',
      completed: completedChallenges.includes('survival_master')
    }
  ];

  // Stats & Persistence
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('asteroids_high_score') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [pilotName, setPilotName] = useState<string>(() => {
    try {
      return localStorage.getItem('asteroids_pilot_name') || 'PILOT_VINCENT';
    } catch {
      return 'PILOT_VINCENT';
    }
  });

  const [highScoresList, setHighScoresList] = useState<HighScoreRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('asteroids_scores_list') || '[]');
    } catch {
      return [];
    }
  });

  const [globalScoresList, setGlobalScoresList] = useState<HighScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('asteroids_global_scores');
      if (saved) return JSON.parse(saved);
      return [
        { id: 'g1', pilotName: 'ACE_NOVA', score: 28450, wave: 14, date: '2026-08-01', mode: 'classic', isGlobal: true },
        { id: 'g2', pilotName: 'STAR_LORD', score: 21200, wave: 11, date: '2026-07-31', mode: 'classic', isGlobal: true },
        { id: 'g3', pilotName: 'NEBULA_PILOT', score: 18900, wave: 9, date: '2026-07-30', mode: 'survival', isGlobal: true },
        { id: 'g4', pilotName: 'COSMIC_VIPER', score: 15400, wave: 8, date: '2026-07-29', mode: 'classic', isGlobal: true },
        { id: 'g5', pilotName: 'HYPER_VALKYRIE', score: 12850, wave: 7, date: '2026-07-28', mode: 'survival', isGlobal: true },
        { id: 'g6', pilotName: 'VOID_WALKER', score: 10200, wave: 6, date: '2026-07-27', mode: 'classic', isGlobal: true }
      ];
    } catch {
      return [
        { id: 'g1', pilotName: 'ACE_NOVA', score: 28450, wave: 14, date: '2026-08-01', mode: 'classic', isGlobal: true },
        { id: 'g2', pilotName: 'STAR_LORD', score: 21200, wave: 11, date: '2026-07-31', mode: 'classic', isGlobal: true },
        { id: 'g3', pilotName: 'NEBULA_PILOT', score: 18900, wave: 9, date: '2026-07-30', mode: 'survival', isGlobal: true },
        { id: 'g4', pilotName: 'COSMIC_VIPER', score: 15400, wave: 8, date: '2026-07-29', mode: 'classic', isGlobal: true },
        { id: 'g5', pilotName: 'HYPER_VALKYRIE', score: 12850, wave: 7, date: '2026-07-28', mode: 'survival', isGlobal: true },
        { id: 'g6', pilotName: 'VOID_WALKER', score: 10200, wave: 6, date: '2026-07-27', mode: 'classic', isGlobal: true }
      ];
    }
  });

  const handleUpdatePilotName = useCallback((name: string) => {
    setPilotName(name);
    try {
      localStorage.setItem('asteroids_pilot_name', name);
    } catch (e) {}
  }, []);

  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('asteroids_lifetime_stats') ||
          JSON.stringify({
            gamesPlayed: 0,
            asteroidsDestroyed: 0,
            ufosDestroyed: 0,
            shotsFired: 0,
            shotsHit: 0,
            highestScore: 0,
            highestWave: 0,
            bombsUsed: 0
          })
      );
    } catch {
      return {
        gamesPlayed: 0,
        asteroidsDestroyed: 0,
        ufosDestroyed: 0,
        shotsFired: 0,
        shotsHit: 0,
        highestScore: 0,
        highestWave: 0,
        bombsUsed: 0
      };
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_blood', title: 'First Blood', description: 'Destroy your first asteroid', icon: 'Target', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'emp_master', title: 'EMP Master', description: 'Trigger an EMP shockwave blast', icon: 'Zap', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'ufo_hunter', title: 'UFO Hunter', description: 'Down an elite UFO interceptor', icon: 'Skull', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'boss_slayer', title: 'Boss Slayer', description: 'Destroy the Dreadnought Warship', icon: 'Crosshair', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'sharpshooter', title: 'Sharpshooter', description: 'Achieve a 10x multiplier combo', icon: 'Star', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'wave_5', title: 'Veteran Pilot', description: 'Survive to Wave 5', icon: 'Award', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'wave_10', title: 'Space Legend', description: 'Reach Wave 10', icon: 'Trophy', unlocked: false, progress: 0, maxProgress: 1 }
  ]);

  // Load Unlocked Achievements
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('asteroids_achievements') || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        setAchievements((prev) =>
          prev.map((ach) => {
            const match = saved.find((s: any) => s.id === ach.id);
            return match ? { ...ach, unlocked: match.unlocked, unlockedAt: match.unlockedAt } : ach;
          })
        );
      }
    } catch (e) {}
  }, []);

  // Sync Audio Engine Volume
  useEffect(() => {
    soundEngine.setMasterVolume(masterVolume);
    soundEngine.setMusicVolume(musicVolume);
    soundEngine.setSfxVolume(sfxVolume);
  }, [masterVolume, musicVolume, sfxVolume]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target && !target.unlocked) {
        soundEngine.playSound('golden');
        const updated = prev.map((a) =>
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString() } : a
        );
        try {
          localStorage.setItem('asteroids_achievements', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prev;
    });
  }, []);

const getInitialWaveForMode = (mode: GameMode): number => {
  return mode === 'wave_15_boss' ? 15 : mode === 'wave_10_boss' ? 10 : mode === 'boss_rush' ? 5 : 1;
};
const getInitialLivesForMode = (mode: GameMode): number => {
  return mode === 'zen' ? 99 : mode === 'survival' ? 1 : 3;
};



  const restartGameForMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setScore(0);
    setWave(getInitialWaveForMode(mode));
    setLives(getInitialLivesForMode(mode));
    setEmpCount(1);
    setHyperspaceCooldown(0);
    setHullPower(100);
    setActivePowerups({});
    setIsGameOver(false);
    setIsNewHighScore(false);
    setIsPaused(false);
    setGameStarted(true);
    setGameKey((prev) => prev + 1);
    soundEngine.init();
    soundEngine.startMusic();
  }, []);

  const handleSettingsModeChange = useCallback(
    (mode: GameMode) => {
      if (gameStarted) {
        restartGameForMode(mode);
      } else {
        setGameMode(mode);
      }
    },
    [gameStarted, restartGameForMode]
  );

  const handleStartGame = useCallback(() => restartGameForMode(gameMode), [gameMode, restartGameForMode]);
  const handleRestart = useCallback(() => restartGameForMode(gameMode), [gameMode, restartGameForMode]);



  const handleGameOver = useCallback(
    (finalScore: number, finalWave: number, asteroidsCount: number, accuracy: number, maxCombo: number, ufosDestroyed: number, bossDamageDealt: number) => {
      setIsGameOver(true);
      setGameOverStats({
        asteroidsDestroyed: asteroidsCount,
        ufosDestroyed,
        maxCombo,
        bossDamageDealt,
        accuracy
      });

      let isNew = false;
      if (finalScore > highScore) {
        setHighScore(finalScore);
        setIsNewHighScore(true);
        isNew = true;
        try {
          localStorage.setItem('asteroids_high_score', finalScore.toString());
        } catch (e) {}
      }

      // Add to high scores list
      const newRecord: HighScoreRecord = {
        id: Math.random().toString(),
        pilotName,
        score: finalScore,
        wave: finalWave,
        date: new Date().toLocaleDateString(),
        mode: gameMode
      };

      setHighScoresList((prev) => {
        const updated = [...prev, newRecord].sort((a, b) => b.score - a.score).slice(0, 10);
        try {
          localStorage.setItem('asteroids_scores_list', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setGlobalScoresList((prev) => {
        const updated = [...prev, newRecord].sort((a, b) => b.score - a.score).slice(0, 10);
        try {
          localStorage.setItem('asteroids_global_scores', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      if (accuracy >= 75) {
        unlockAchievement('sharpshooter');
      }
    },
    [highScore, gameMode, unlockAchievement, pilotName]
  );

  const handleStatsRecord = useCallback(
    (asteroids: number, ufos: number, shotsFired: number, shotsHit: number, empUsed: number, finalScore: number, finalWave: number, maxCombo: number, bossDamageDealt: number) => {
      setLifetimeStats((prev) => {
        const updated: LifetimeStats = {
          gamesPlayed: prev.gamesPlayed + 1,
          asteroidsDestroyed: prev.asteroidsDestroyed + asteroids,
          ufosDestroyed: prev.ufosDestroyed + ufos,
          shotsFired: prev.shotsFired + shotsFired,
          shotsHit: prev.shotsHit + shotsHit,
          highestScore: Math.max(prev.highestScore, finalScore),
          highestWave: Math.max(prev.highestWave, finalWave),
          bombsUsed: prev.bombsUsed + empUsed
        };
        try {
          localStorage.setItem('asteroids_lifetime_stats', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      if (asteroids > 0) unlockAchievement('first_blood');

      // Check Challenges
      const accuracy = shotsFired > 0 ? Math.min(100, Math.max(0, Math.round((shotsHit / shotsFired) * 100))) : 0;
      const newlyCompleted: string[] = [];
      const check = (id: string, condition: boolean) => {
        if (condition && !completedChallenges.includes(id) && !newlyCompleted.includes(id)) {
          newlyCompleted.push(id);
        }
      };

      check('wave_10', gameMode === 'classic' && finalWave >= 10);
      check('purist', gameMode === 'classic' && finalWave >= 10 && empUsed === 0);
      check('chain_reaction', maxCombo >= 15);
      check('marksman', finalWave >= 8 && shotsFired >= 50 && accuracy >= 70);
      check('ufo_hunter', ufos >= 3);
      check('boss_veteran', bossDamageDealt >= 2000);
      check('survival_master', gameMode === 'survival' && finalWave >= 8);

      if (newlyCompleted.length > 0) {
        const updated = [...completedChallenges, ...newlyCompleted];
        setCompletedChallenges(updated);
        try {
          localStorage.setItem('asteroids_completed_challenges', JSON.stringify(updated));
        } catch (e) {}
      }
    },
    [unlockAchievement, gameMode, completedChallenges]
  );

  // Mute Toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMusicOn(!next);
      soundEngine.setSfxOn(!next);
      return next;
    });
  }, []);

  // Keyboard Pause / Mute shortcuts
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
      if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [gameStarted, handleToggleMute]);

  const effectivePaused = isPaused || !gameStarted || showSettings || showLeaderboard || showAchievements || showChallenges;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0C10] text-[#E6EDF3] font-sans select-none">
      {/* Main Asteroids Canvas Engine */}
      <AsteroidsCanvas
        isTouchDevice={isTouchDevice}
        key={gameKey}
        gameMode={gameMode}
        initialWave={wave}
        initialLives={lives}
        controlScheme={controlScheme}
        isPaused={effectivePaused}
        crtFilter={crtFilter}
        screenShakeEnabled={screenShake}
        onScoreUpdate={setScore}
        onWaveUpdate={setWave}
        onLivesUpdate={setLives}
        onEmpCountUpdate={setEmpCount}
        onEmpRechargeProgressUpdate={setEmpRechargeProgress}
        onHyperspaceCooldownUpdate={setHyperspaceCooldown}
        onHullPowerUpdate={setHullPower}
        onActivePowerupsUpdate={setActivePowerups}
        onHudProximityUpdate={setIsShipNearHud}
        onGameOver={handleGameOver}
        onStatsRecord={handleStatsRecord}
        onUnlockAchievement={unlockAchievement}
      />

      {/* Start Screen Overlay */}
      {!gameStarted && (
        <StartScreen
          highScore={highScore}
          gameMode={gameMode}
          onChangeGameMode={setGameMode}
          controlScheme={controlScheme}
          onChangeControlScheme={setControlScheme}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onStartGame={handleStartGame}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onOpenChallenges={() => setShowChallenges(true)}
          onOpenSettings={() => setShowSettings(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />
      )}

      {/* Retro Arcade HUD */}
      <HUD
        score={score}
        highScore={highScore}
        wave={wave}
        lives={lives}
        mode={gameMode}
        empCount={empCount}
        empRechargeProgress={empRechargeProgress}
        hyperspaceCooldown={hyperspaceCooldown}
        hullPower={hullPower}
        maxHullPower={maxHullPower}
        activePowerups={activePowerups}
        isPaused={isPaused}
        isMuted={isMuted}
        isShipNearHUD={isShipNearHud}
        isTouchDevice={isTouchDevice}
        onTogglePause={() => setIsPaused((p) => !p)}
        onToggleMute={handleToggleMute}
        onOpenSettings={() => setShowSettings(true)}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {isTouchDevice && (
      <>
      {/* Mobile/Tablet Touch Controls */}
      <TouchControls
        isPaused={effectivePaused}
        onThrustStart={() => {
          const evt = new KeyboardEvent('keydown', { key: 'w' });
          window.dispatchEvent(evt);
        }}
        onThrustEnd={() => {
          const evt = new KeyboardEvent('keyup', { key: 'w' });
          window.dispatchEvent(evt);
        }}
        onReverseStart={() => {
          const evt = new KeyboardEvent('keydown', { key: 's' });
          window.dispatchEvent(evt);
        }}
        onReverseEnd={() => {
          const evt = new KeyboardEvent('keyup', { key: 's' });
          window.dispatchEvent(evt);
        }}
        onTurnLeftStart={() => {
          const evt = new KeyboardEvent('keydown', { key: 'a' });
          window.dispatchEvent(evt);
        }}
        onTurnLeftEnd={() => {
          const evt = new KeyboardEvent('keyup', { key: 'a' });
          window.dispatchEvent(evt);
        }}
        onTurnRightStart={() => {
          const evt = new KeyboardEvent('keydown', { key: 'd' });
          window.dispatchEvent(evt);
        }}
        onTurnRightEnd={() => {
          const evt = new KeyboardEvent('keyup', { key: 'd' });
          window.dispatchEvent(evt);
        }}
        onFire={() => {
          const evt = new KeyboardEvent('keydown', { key: ' ' });
          window.dispatchEvent(evt);
        }}
        onEMP={() => {
          const evt = new KeyboardEvent('keydown', { key: 'b' });
          window.dispatchEvent(evt);
        }}
        onHyperspace={() => {
          const evt = new KeyboardEvent('keydown', { key: 'Shift' });
          window.dispatchEvent(evt);
        }}
        empCount={empCount}
        hyperspaceReady={hyperspaceCooldown <= 0}
      />
      </>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          wave={wave}
          asteroidsDestroyed={gameOverStats.asteroidsDestroyed}
          ufosDestroyed={gameOverStats.ufosDestroyed}
          accuracy={gameOverStats.accuracy}
          maxCombo={gameOverStats.maxCombo}
          bossDamageDealt={gameOverStats.bossDamageDealt}
          onRestart={handleRestart}
          onOpenLeaderboard={() => {
            setShowLeaderboard(true);
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        gameMode={gameMode}
        onChangeGameMode={handleSettingsModeChange}
        controlScheme={controlScheme}
        onChangeControlScheme={setControlScheme}
        masterVolume={masterVolume}
        onChangeMasterVolume={setMasterVolume}
        musicVolume={musicVolume}
        onChangeMusicVolume={setMusicVolume}
        sfxVolume={sfxVolume}
        onChangeSfxVolume={setSfxVolume}
        crtFilter={crtFilter}
        onToggleCrtFilter={() => setCrtFilter((p) => !p)}
        screenShake={screenShake}
        onToggleScreenShake={() => setScreenShake((p) => !p)}

      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        scores={highScoresList}
        globalScores={globalScoresList}
        stats={lifetimeStats}
        pilotName={pilotName}
        onUpdatePilotName={handleUpdatePilotName}
        onClearData={() => {
          localStorage.removeItem('asteroids_scores_list');
          localStorage.removeItem('asteroids_lifetime_stats');
          localStorage.removeItem('asteroids_high_score');
          setHighScoresList([]);
          setHighScore(0);
          setLifetimeStats({
            gamesPlayed: 0,
            asteroidsDestroyed: 0,
            ufosDestroyed: 0,
            shotsFired: 0,
            shotsHit: 0,
            highestScore: 0,
            highestWave: 0,
            bombsUsed: 0
          });
        }}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        achievements={achievements}
      />

      {/* Challenges Modal */}
      <ChallengesModal
        isOpen={showChallenges}
        onClose={() => setShowChallenges(false)}
        challenges={challengesList}
      />
    </div>
  );
}
