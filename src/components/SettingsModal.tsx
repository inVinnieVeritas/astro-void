import React from 'react';
import { X, Volume2, VolumeX, Monitor, Gamepad2, Sliders, Shield, Zap } from 'lucide-react';
import { GameMode, ControlScheme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: GameMode;
  onChangeGameMode: (mode: GameMode) => void;
  controlScheme: ControlScheme;
  onChangeControlScheme: (scheme: ControlScheme) => void;
  masterVolume: number;
  onChangeMasterVolume: (val: number) => void;
  musicVolume: number;
  onChangeMusicVolume: (val: number) => void;
  sfxVolume: number;
  onChangeSfxVolume: (val: number) => void;
  crtFilter: boolean;
  onToggleCrtFilter: () => void;
  screenShake: boolean;
  onToggleScreenShake: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gameMode,
  onChangeGameMode,
  controlScheme,
  onChangeControlScheme,
  masterVolume,
  onChangeMasterVolume,
  musicVolume,
  onChangeMusicVolume,
  sfxVolume,
  onChangeSfxVolume,
  crtFilter,
  onToggleCrtFilter,
  screenShake,
  onToggleScreenShake
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl max-w-lg w-full p-5 text-[#E6EDF3] shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-[#30363D]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#58A6FF]" />
            <h2 className="text-base font-bold font-mono tracking-wide text-[#E6EDF3]">GAME SETTINGS</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8B949E] hover:text-[#E6EDF3] rounded hover:bg-[#21262D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 my-5">
          {/* Game Mode */}
          <div>
            <label className="text-[10px] font-mono font-bold text-[#8B949E] tracking-wider block mb-1.5 uppercase">GAME MODE</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'classic', label: 'Classic', desc: 'Standard Lives & Waves' },
                { id: 'survival', label: 'Survival', desc: '1 Ship • No Extra Lives' },
                { id: 'zen', label: 'Zen', desc: 'Invincible Practice' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onChangeGameMode(m.id as GameMode);
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    gameMode === m.id
                      ? 'bg-[#1F6FEB]/15 border-[#1F6FEB] text-[#58A6FF]'
                      : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'
                  }`}
                >
                  <div className="font-mono font-bold text-xs text-[#E6EDF3]">{m.label}</div>
                  <div className="text-[10px] text-[#8B949E] mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Control Scheme */}
          <div>
            <label className="text-[10px] font-mono font-bold text-[#8B949E] tracking-wider block mb-1.5 uppercase">CONTROL SCHEME</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'classic', label: 'Classic Asteroids', desc: 'Rotate with WASD/Arrows' },
                { id: 'mouse', label: 'Mouse Aim & Shoot', desc: 'Ship faces cursor' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onChangeControlScheme(c.id as ControlScheme)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    controlScheme === c.id
                      ? 'bg-[#1F6FEB]/15 border-[#1F6FEB] text-[#58A6FF]'
                      : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'
                  }`}
                >
                  <div className="font-mono font-bold text-xs flex items-center gap-1.5 text-[#E6EDF3]">
                    <Gamepad2 className="w-3.5 h-3.5 text-[#A371F7]" />
                    <span>{c.label}</span>
                  </div>
                  <div className="text-[10px] text-[#8B949E] mt-0.5">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Mix Controls */}
          <div className="space-y-3 bg-[#0D1117] p-3.5 rounded-lg border border-[#30363D]">
            <div className="text-[11px] font-mono font-bold text-[#E6EDF3] tracking-wider flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#3FB950]" />
              <span>AUDIO MIXER</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#8B949E] mb-1">
                <span>Master Volume</span>
                <span>{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => onChangeMasterVolume(parseFloat(e.target.value))}
                className="w-full accent-[#1F6FEB] bg-[#21262D] h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#8B949E] mb-1">
                <span>Synthesizer Music</span>
                <span>{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
                className="w-full accent-[#3FB950] bg-[#21262D] h-1.5 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-[#8B949E] mb-1">
                <span>Sound Effects (SFX)</span>
                <span>{Math.round(sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => onChangeSfxVolume(parseFloat(e.target.value))}
                className="w-full accent-[#A371F7] bg-[#21262D] h-1.5 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Visual Effects Switches */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleCrtFilter}
              className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                crtFilter ? 'bg-[#1F6FEB]/10 border-[#1F6FEB] text-[#58A6FF]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-[#58A6FF]" />
                <span className="text-xs font-mono font-bold">CRT Scanlines</span>
              </div>
              <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${crtFilter ? 'bg-[#1F6FEB]' : 'bg-[#21262D]'}`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${crtFilter ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </div>
            </button>

            <button
              onClick={onToggleScreenShake}
              className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                screenShake ? 'bg-[#1F6FEB]/10 border-[#1F6FEB] text-[#A371F7]' : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#A371F7]" />
                <span className="text-xs font-mono font-bold">Screen Shake</span>
              </div>
              <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${screenShake ? 'bg-[#A371F7]' : 'bg-[#21262D]'}`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${screenShake ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-[#30363D]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#238636] hover:bg-[#2ea043] font-mono font-bold text-white text-xs rounded-lg transition-all border border-[#2ea043]/50"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
