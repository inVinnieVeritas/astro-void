import { soundEngine } from './soundEngine';

const MISSION_MODE_LABELS = [
  'CLASSIC',
  'SURVIVAL',
  'ZEN VOID',
  'WAVE 5 BOSS',
  'CORE SEVERANCE',
  'THE GRID ARCHITECT',
] as const;

const HOVER_COOLDOWN_MS = 80;
let lastHoverSoundAt = 0;

const isMissionModeButton = (button: HTMLButtonElement): boolean => {
  const text = (button.textContent ?? '').replace(/\s+/g, ' ').trim();
  return MISSION_MODE_LABELS.some((label) => text.startsWith(label));
};

const handlePointerOver = (event: PointerEvent) => {
  // Touch devices should retain their existing behavior. This is mouse hover feedback only.
  if (event.pointerType !== 'mouse') return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest('button');
  if (!(button instanceof HTMLButtonElement) || !isMissionModeButton(button)) return;

  // pointerover bubbles when crossing children inside a button. Only sound on actual button entry.
  const relatedTarget = event.relatedTarget;
  if (relatedTarget instanceof Node && button.contains(relatedTarget)) return;

  const now = performance.now();
  if (now - lastHoverSoundAt < HOVER_COOLDOWN_MS) return;
  lastHoverSoundAt = now;

  // Reuse the existing SFX engine so master/SFX volume and mute state are respected.
  soundEngine.playSound('powerup');
};

// Unlock Web Audio on normal user activation when browsers require it.
const unlockAudio = () => soundEngine.ensureContext();

window.addEventListener('pointerover', handlePointerOver, { passive: true });
window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
window.addEventListener('keydown', unlockAudio, { once: true });
