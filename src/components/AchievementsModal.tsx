import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl max-w-xl w-full p-5 text-[#E6EDF3] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#A371F7]" />
            <h2 className="text-base font-bold font-mono tracking-wide text-[#A371F7]">ACHIEVEMENTS</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8B949E] hover:text-[#E6EDF3] rounded hover:bg-[#21262D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="my-3 bg-[#0D1117] p-3 rounded-lg border border-[#30363D] flex items-center justify-between">
          <div className="text-xs font-mono font-semibold text-[#8B949E]">
            UNLOCKED: <span className="text-[#A371F7] font-bold">{unlockedCount} / {achievements.length}</span>
          </div>
          <div className="w-48 bg-[#21262D] h-2 rounded-full overflow-hidden border border-[#30363D]">
            <div
              className="bg-[#A371F7] h-full transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto space-y-2 my-2 pr-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                item.unlocked
                  ? 'bg-[#161B22] border-[#30363D] text-[#E6EDF3]'
                  : 'bg-[#0D1117]/60 border-[#21262D] text-[#8B949E] opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${item.unlocked ? 'bg-[#A371F7]/15 text-[#A371F7]' : 'bg-[#21262D] text-[#8B949E]'}`}>
                  {item.unlocked ? <CheckCircle2 className="w-4 h-4 text-[#3FB950]" /> : <Lock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-mono font-bold text-xs text-[#E6EDF3] flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.unlocked && item.unlockedAt && (
                      <span className="text-[10px] text-[#A371F7] font-normal">({item.unlockedAt})</span>
                    )}
                  </div>
                  <div className="text-xs text-[#8B949E] mt-0.5">{item.description}</div>
                </div>
              </div>

              {!item.unlocked && item.maxProgress > 1 && (
                <div className="text-right text-xs font-mono text-[#8B949E]">
                  {item.progress} / {item.maxProgress}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#30363D]">
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
