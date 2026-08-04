import React, { useState } from 'react';
import { X, Trophy, Target, Globe, Flame, Skull, Zap, User, Edit3, Check } from 'lucide-react';
import { HighScoreRecord, LifetimeStats } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: HighScoreRecord[];
  globalScores: HighScoreRecord[];
  stats: LifetimeStats;
  pilotName: string;
  onUpdatePilotName: (name: string) => void;
  onClearData: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  scores,
  globalScores,
  stats,
  pilotName,
  onUpdatePilotName,
  onClearData
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'local'>('global');
  const [editingName, setEditingName] = useState(pilotName);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const accuracy = stats.shotsFired > 0 ? Math.min(100, Math.max(0, Math.round((stats.shotsHit / stats.shotsFired) * 100))) : 0;

  const handleSaveName = () => {
    const trimmed = editingName.trim().toUpperCase().slice(0, 15) || 'PILOT_ACE';
    onUpdatePilotName(trimmed);
    setEditingName(trimmed);
    setIsEditing(false);
  };

  const displayList = activeTab === 'global' ? globalScores : scores;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl max-w-xl w-full p-5 text-[#E6EDF3] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#D29922]" />
            <h2 className="text-base font-bold font-mono tracking-wide text-[#D29922]">GALACTIC HALL OF FAME</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8B949E] hover:text-[#E6EDF3] rounded hover:bg-[#21262D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pilot Callsign Config Box */}
        <div className="mt-3 bg-[#0D1117] border border-[#30363D] rounded-lg p-3 flex items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs text-[#8B949E]">PILOT CALLSIGN:</span>
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                maxLength={15}
                className="bg-[#161B22] border border-[#38bdf8] text-[#38bdf8] px-2 py-0.5 rounded text-xs font-bold uppercase focus:outline-none"
                autoFocus
              />
            ) : (
              <span className="text-xs font-extrabold text-[#38bdf8] tracking-wider bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/30">
                {pilotName}
              </span>
            )}
          </div>
          <div>
            {isEditing ? (
              <button
                onClick={handleSaveName}
                className="px-2.5 py-1 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded flex items-center gap-1 transition-all"
              >
                <Check className="w-3 h-3" /> SAVE
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-[#8B949E] hover:text-[#38bdf8] transition-colors flex items-center gap-1 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" /> EDIT
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mt-3 font-mono text-xs">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'global'
                ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#38bdf8]'
                : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GLOBAL LEADERBOARD</span>
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'local'
                ? 'bg-[#D29922]/15 border-[#D29922] text-[#D29922]'
                : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>LOCAL SCORES</span>
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 my-3 pr-1">
          {/* Stats Overview Bento Grid */}
          <div>
            <div className="text-[10px] font-mono font-bold text-[#8B949E] tracking-wider mb-2 uppercase">LIFETIME COMMANDER STATS</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5">
                <div className="text-[#8B949E] text-[10px] font-mono font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#D29922]" />
                  <span>METEORS</span>
                </div>
                <div className="text-lg font-extrabold text-[#E6EDF3] font-mono mt-0.5">
                  {stats.asteroidsDestroyed.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5">
                <div className="text-[#8B949E] text-[10px] font-mono font-semibold flex items-center gap-1">
                  <Skull className="w-3 h-3 text-[#F85149]" />
                  <span>UFOS DOWNED</span>
                </div>
                <div className="text-lg font-extrabold text-[#E6EDF3] font-mono mt-0.5">
                  {stats.ufosDestroyed.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5">
                <div className="text-[#8B949E] text-[10px] font-mono font-semibold flex items-center gap-1">
                  <Target className="w-3 h-3 text-[#58A6FF]" />
                  <span>ACCURACY</span>
                </div>
                <div className="text-lg font-extrabold text-[#58A6FF] font-mono mt-0.5">
                  {accuracy}%
                </div>
              </div>

              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-2.5">
                <div className="text-[#8B949E] text-[10px] font-mono font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#D29922]" />
                  <span>EMP BOMBS</span>
                </div>
                <div className="text-lg font-extrabold text-[#E6EDF3] font-mono mt-0.5">
                  {stats.bombsUsed.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div>
            <div className="text-[10px] font-mono font-bold text-[#8B949E] tracking-wider mb-2 uppercase flex items-center justify-between">
              <span>{activeTab === 'global' ? '🌐 GALACTIC TOP ACES' : '🏆 LOCAL TOP SCORES'}</span>
              <span className="text-[#58A6FF] text-[9px]">LIVE PERSISTENT RANKINGS</span>
            </div>
            {displayList.length === 0 ? (
              <div className="text-center py-6 text-[#8B949E] text-xs font-mono bg-[#0D1117] rounded-lg border border-[#30363D]">
                No high scores recorded yet. Blast away asteroids to stake your claim!
              </div>
            ) : (
              <div className="bg-[#0D1117] border border-[#30363D] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#21262D] text-[#8B949E] font-semibold border-b border-[#30363D]">
                    <tr>
                      <th className="p-2.5 w-10 text-center">RANK</th>
                      <th className="p-2.5">PILOT</th>
                      <th className="p-2.5">SCORE</th>
                      <th className="p-2.5">WAVE</th>
                      <th className="p-2.5">MODE</th>
                      <th className="p-2.5 text-right">DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363D]">
                    {displayList.slice(0, 10).map((record, index) => {
                      const isSelf = record.pilotName === pilotName;
                      return (
                        <tr
                          key={record.id || index}
                          className={`transition-colors ${
                            isSelf ? 'bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20' : 'hover:bg-[#161B22]'
                          }`}
                        >
                          <td className="p-2.5 text-center font-bold">
                            {index === 0 && <span className="text-[#D29922]">👑 1</span>}
                            {index === 1 && <span className="text-[#8B949E]">🥈 2</span>}
                            {index === 2 && <span className="text-[#D29922]/80">🥉 3</span>}
                            {index > 2 && <span className="text-[#8B949E]">{index + 1}</span>}
                          </td>
                          <td className="p-2.5 font-bold flex items-center gap-1.5">
                            <span className={isSelf ? 'text-[#38bdf8]' : 'text-[#E6EDF3]'}>
                              {record.pilotName || 'UNKNOWN_PILOT'}
                            </span>
                            {isSelf && (
                              <span className="text-[9px] bg-[#38bdf8]/20 text-[#38bdf8] px-1 rounded font-normal">YOU</span>
                            )}
                          </td>
                          <td className="p-2.5 font-extrabold text-[#E6EDF3]">{record.score.toLocaleString()}</td>
                          <td className="p-2.5 text-[#58A6FF]">Wave {record.wave}</td>
                          <td className="p-2.5 text-[#3FB950] uppercase text-[10px]">{record.mode}</td>
                          <td className="p-2.5 text-right text-[#8B949E] text-[10px]">{record.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-[#30363D]">
          <button
            onClick={onClearData}
            className="text-xs font-mono text-[#F85149] hover:underline"
          >
            Reset Local High Scores
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#21262D] hover:bg-[#30363D] font-mono font-bold text-[#E6EDF3] text-xs rounded-lg transition-all border border-[#30363D]"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
