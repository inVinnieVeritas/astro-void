import React from 'react';
import { X, Target, CheckCircle2, Lock, Flame } from 'lucide-react';

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  rewardText: string;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
}

interface ChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: ChallengeItem[];
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({
  isOpen,
  onClose,
  challenges
}) => {
  if (!isOpen) return null;

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl max-w-xl w-full p-5 text-[#E6EDF3] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#38BDF8]" />
            <h2 className="text-base font-bold font-mono tracking-wide text-[#38BDF8]">PILOT CHALLENGES</h2>
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
            COMPLETED: <span className="text-[#38BDF8] font-bold">{completedCount} / {challenges.length}</span>
          </div>
          <div className="w-48 bg-[#21262D] h-2 rounded-full overflow-hidden border border-[#30363D]">
            <div
              className="bg-[#38BDF8] h-full transition-all duration-500"
              style={{ width: `${(completedCount / challenges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Challenges List */}
        <div className="overflow-y-auto space-y-2.5 my-2 pr-1">
          {challenges.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                item.completed
                  ? 'bg-[#161B22] border-[#38bdf8]/40 text-[#E6EDF3] shadow-[0_0_15px_rgba(56,189,248,0.1)]'
                  : 'bg-[#0D1117]/60 border-[#21262D] text-[#8B949E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${item.completed ? 'bg-[#38bdf8]/15 text-[#38bdf8]' : 'bg-[#21262D] text-[#8B949E]'}`}>
                  {item.completed ? <CheckCircle2 className="w-4 h-4 text-[#3FB950]" /> : <Target className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-mono font-bold text-xs text-[#E6EDF3] flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-[#38bdf8] font-normal bg-[#38bdf8]/10 px-1.5 py-0.5 rounded border border-[#38bdf8]/20">
                      {item.rewardText}
                    </span>
                  </div>
                  <div className="text-xs text-[#8B949E] mt-0.5">{item.description}</div>
                </div>
              </div>

              {!item.completed && item.maxProgress && item.maxProgress > 1 && (
                <div className="text-right text-xs font-mono text-[#8B949E]">
                  {item.progress || 0} / {item.maxProgress}
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
