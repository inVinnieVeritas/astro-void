/**
 * Web Audio Synthesizer Engine for Asteroids Arcade
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicOn = true;
  private sfxOn = true;
  private masterVolume = 0.7;
  private musicVolume = 0.5;
  private sfxVolume = 0.8;

  private musicNodes: (AudioNode | number)[] = [];
  private musicInterval: any = null;
  private noteIndex = 0;
  private musicIntensity = 1.0; // 1 = normal, >1.3 = intense/UFO

  private alarmOsc: OscillatorNode | null = null;
  private alarmGain: GainNode | null = null;
  private alarmInterval: any = null;

  private thrustOsc: OscillatorNode | null = null;
  private thrustNoise: AudioBufferSourceNode | null = null;
  private thrustGain: GainNode | null = null;

  private reverseOsc: OscillatorNode | null = null;
  private reverseGain: GainNode | null = null;

  private isInitialized = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isInitialized = true;
  }

  public ensureContext() {
    this.initContext();
  }

  public init() {
    this.initContext();
  }

  // --- Volume Getters / Setters ---
  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }
  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }
  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }
  public setMusicOn(on: boolean) {
    this.musicOn = on;
    if (on) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }
  public setSfxOn(on: boolean) {
    this.sfxOn = on;
  }
  public setMusicIntensity(intensity: number) {
    this.musicIntensity = intensity;
  }

  public playUfoAlarm() {
    this.startUfoAlarm();
  }

  public isMusicEnabled(): boolean {
    return this.musicOn;
  }
  public isSfxEnabled(): boolean {
    return this.sfxOn;
  }

  // --- Pause & Resume Audio ---
  public pauseAll() {
    this.stopThrustSound();
    this.stopUfoAlarm();
    if (this.ctx && this.ctx.state === 'running') {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
  }

  public resumeAll() {
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume();
      } catch (e) {}
    }
  }

  // --- Dynamic Music ---
  private currentStep = 0;
  private musicFilterNode: BiquadFilterNode | null = null;

  // Smooth Ambient Space Scales & Chords
  private bassNotes = [43.65, 43.65, 51.91, 58.27, 43.65, 51.91, 65.41, 58.27]; // F0, G#0, A#0, C1 (Warm deep sub-bass)
  private arpNotes = [174.61, 207.65, 261.63, 311.13, 349.23, 415.30, 523.25]; // F3, G#3, C4, D#4, F4, G#4, C5
  private padChords = [
    [174.61, 261.63, 311.13, 415.30], // Fm7
    [138.59, 207.65, 261.63, 349.23], // C#maj7
    [155.56, 233.08, 311.13, 392.00], // D#add9
    [174.61, 261.63, 349.23, 440.00]  // Fm9
  ];

  public startMusic() {
    if (!this.musicOn) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.stopMusic();

    const masterGain = this.ctx.createGain();
    const vol = this.masterVolume * this.musicVolume * 0.12;
    masterGain.gain.value = vol;
    masterGain.connect(this.ctx.destination);

    // Warm Lowpass Space Filter
    const musicFilter = this.ctx.createBiquadFilter();
    musicFilter.type = 'lowpass';
    musicFilter.frequency.value = 850;
    musicFilter.Q.value = 1.0;
    musicFilter.connect(masterGain);
    this.musicFilterNode = musicFilter;

    // Ambient Lush Space Pad (Sine & Smooth Triangle Layers)
    const pad1 = this.ctx.createOscillator();
    const pad2 = this.ctx.createOscillator();
    const pad3 = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();

    pad1.type = 'sine';
    pad2.type = 'triangle';
    pad3.type = 'sine';

    pad1.frequency.value = 174.61; // F3
    pad2.frequency.value = 261.63; // C4
    pad3.frequency.value = 311.13; // D#4

    padGain.gain.value = 0.08;
    pad1.connect(padGain);
    pad2.connect(padGain);
    pad3.connect(padGain);
    padGain.connect(musicFilter);

    try {
      pad1.start();
      pad2.start();
      pad3.start();
    } catch (e) {}

    this.musicNodes = [pad1, pad2, pad3, padGain, musicFilter, masterGain];

    this.currentStep = 0;
    const playTick = () => {
      if (!this.musicOn || !this.ctx) return;

      const isIntense = this.musicIntensity > 1.3;
      const stepTimeMs = isIntense ? 180 : 260; // Smooth, relaxed pacing
      const now = this.ctx.currentTime;

      // Dynamically filter brightness without harshness
      if (this.musicFilterNode) {
        const targetCutoff = isIntense ? 1400 : 850;
        this.musicFilterNode.frequency.setTargetAtTime(targetCutoff, now, 0.2);
      }

      const step = this.currentStep % 16;
      const chordIndex = Math.floor((this.currentStep / 16) % 4);

      // Smoothly update pad chord frequencies
      if (step === 0 && this.padChords[chordIndex]) {
        const chord = this.padChords[chordIndex];
        pad1.frequency.setTargetAtTime(chord[0], now, 0.4);
        pad2.frequency.setTargetAtTime(chord[1], now, 0.4);
        pad3.frequency.setTargetAtTime(chord[2], now, 0.4);
      }

      // 1. CLASSIC DEEP SUB-BASS PULSE ("Heartbeat of Space")
      if (step % 4 === 0 || step % 4 === 2) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        const bFilter = this.ctx.createBiquadFilter();

        bOsc.type = 'triangle';
        const bassFreq = this.bassNotes[(Math.floor(step / 2) + chordIndex) % this.bassNotes.length];
        bOsc.frequency.setValueAtTime(bassFreq, now);

        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(300, now);

        const bVol = (step % 4 === 0 ? 0.35 : 0.22) * this.masterVolume * this.musicVolume;
        bGain.gain.setValueAtTime(bVol, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        bOsc.connect(bFilter);
        bFilter.connect(musicFilter);

        try {
          bOsc.start(now);
          bOsc.stop(now + 0.24);
        } catch (e) {}
      }

      // 2. CRYSTAL AMBIENT COSMIC ARPEGGIATOR (Soft Sine Wave Echoes)
      if (step % 2 === 0 || isIntense) {
        const arpFreq = this.arpNotes[(step * 2 + chordIndex * 3) % this.arpNotes.length];
        const aOsc = this.ctx.createOscillator();
        const aGain = this.ctx.createGain();

        aOsc.type = 'sine';
        aOsc.frequency.setValueAtTime(arpFreq, now);

        const aVol = (step % 4 === 0 ? 0.12 : 0.07) * this.masterVolume * this.musicVolume;
        aGain.gain.setValueAtTime(aVol, now);
        aGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.28);

        aOsc.connect(aGain);
        aGain.connect(musicFilter);

        try {
          aOsc.start(now);
          aOsc.stop(now + 0.3);
        } catch (e) {}
      }

      // 3. MELLOW DEEP KICK (Soft Sub Impulse)
      if (step === 0 || step === 8) {
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.type = 'sine';
        kOsc.frequency.setValueAtTime(90, now);
        kOsc.frequency.exponentialRampToValueAtTime(25, now + 0.12);

        kGain.gain.setValueAtTime(0.28 * this.masterVolume * this.musicVolume, now);
        kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        kOsc.connect(kGain);
        kGain.connect(masterGain);
        try {
          kOsc.start(now);
          kOsc.stop(now + 0.15);
        } catch (e) {}
      }

      this.currentStep++;
      this.musicInterval = setTimeout(playTick, stepTimeMs);
    };

    playTick();
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
    this.musicNodes.forEach(n => {
      if (typeof n !== 'number' && (n as any).stop) {
        try { (n as any).stop(); } catch (e) {}
      }
    });
    this.musicNodes = [];
    this.musicFilterNode = null;
  }

  // --- UFO Alarm (Smooth Atmospheric Sci-Fi Saucer Hum) ---
  private ufoAlarmNodes: AudioNode[] = [];

  public startUfoAlarm() {
    if (this.ufoAlarmNodes.length > 0) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Smooth pure-sine dual theremin oscillator for mysterious alien hum
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(360, now);
    osc2.frequency.setValueAtTime(364, now); // Gentle 4Hz beating ring

    // Slow smooth 3.5Hz vibrato pitch modulation LFO
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(3.5, now);
    lfoGain.gain.setValueAtTime(35, now); // Pitch wobble depth

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    filter.type = 'lowpass';
    filter.frequency.value = 650;
    filter.Q.value = 1.0;

    // Soft volume so it alerts without piercing or annoying
    const vol = 0.065 * this.masterVolume * this.sfxVolume;
    gainNode.gain.setValueAtTime(vol, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    try {
      osc1.start(now);
      osc2.start(now);
      lfo.start(now);
    } catch (e) {}

    this.ufoAlarmNodes = [osc1, osc2, lfo, lfoGain, filter, gainNode];
  }

  public stopUfoAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    this.ufoAlarmNodes.forEach(node => {
      if ((node as OscillatorNode).stop) {
        try { (node as OscillatorNode).stop(); } catch (e) {}
      }
    });
    this.ufoAlarmNodes = [];
  }

  // --- Thruster Sound ---
  public startThrustSound() {
    if (this.thrustOsc || !this.sfxOn) return;
    this.ensureContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.thrustNoise = this.ctx.createBufferSource();
    this.thrustNoise.buffer = buffer;
    this.thrustNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 380;

    this.thrustGain = this.ctx.createGain();
    const vol = 0.12 * this.masterVolume * this.sfxVolume;
    this.thrustGain.gain.value = vol;

    this.thrustOsc = this.ctx.createOscillator();
    this.thrustOsc.type = 'sawtooth';
    this.thrustOsc.frequency.value = 48;

    const humGain = this.ctx.createGain();
    humGain.gain.value = 0.06;

    this.thrustNoise.connect(filter);
    filter.connect(this.thrustGain);
    this.thrustOsc.connect(humGain);
    humGain.connect(this.thrustGain);
    this.thrustGain.connect(this.ctx.destination);

    try {
      this.thrustNoise.start();
      this.thrustOsc.start();
    } catch (e) {}
  }

  public stopThrustSound() {
    if (this.thrustOsc) {
      try {
        this.thrustOsc.stop();
        if (this.thrustNoise) this.thrustNoise.stop();
      } catch (e) {}
      this.thrustOsc = null;
      this.thrustNoise = null;
      this.thrustGain = null;
    }
  }

  public startReverseSound() {
    if (this.reverseOsc || !this.sfxOn) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.reverseOsc = this.ctx.createOscillator();
    this.reverseGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    this.reverseOsc.type = 'sawtooth';
    this.reverseOsc.frequency.value = 55;
    filter.type = 'lowpass';
    filter.frequency.value = 250;
    const vol = 0.08 * this.masterVolume * this.sfxVolume;
    this.reverseGain.gain.value = vol;

    this.reverseOsc.connect(filter);
    filter.connect(this.reverseGain);
    this.reverseGain.connect(this.ctx.destination);

    try {
      this.reverseOsc.start();
    } catch (e) {}
  }

  public stopReverseSound() {
    if (this.reverseOsc) {
      try { this.reverseOsc.stop(); } catch (e) {}
      this.reverseOsc = null;
      this.reverseGain = null;
    }
  }

  // --- Sound Effects ---
  public playSound(type: 'shoot' | 'laser' | 'explode' | 'heavy_explode' | 'powerup' | 'golden' | 'emp' | 'ufo' | 'death' | 'shield_hit' | 'jump' | 'ui_hover') {
    if (!this.sfxOn) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const sfxVol = this.masterVolume * this.sfxVolume;

    if (type === 'ui_hover') {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const osc2Gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'triangle';
      osc2.type = 'square';

      // Downward pitch movement
      osc1.frequency.setValueAtTime(1050, now);
      osc1.frequency.exponentialRampToValueAtTime(620, now + 0.055);
      
      // Second quiet square oscillator one octave lower for a digital edge
      osc2.frequency.setValueAtTime(525, now);
      osc2.frequency.exponentialRampToValueAtTime(310, now + 0.055);

      // Mix osc2 lower
      osc2Gain.gain.value = 0.25;

      // Filter to keep it synthetic but not overly piercing
      filter.type = 'lowpass';
      filter.frequency.value = 2400;

      // Envelope: Fast attack, rapid decay
      const vol = 0.11 * sfxVol;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      // Routing
      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      try {
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.06);
        osc2.stop(now + 0.06);
      } catch(e) {}
      return;
    }


    if (type === 'death' || type === 'heavy_explode') {
      const bufferSize = this.ctx.sampleRate * 1.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 3.5);
        const boom = Math.sin(t * 35) * Math.exp(-t * 2.2) * 0.7;
        data[i] = noise * 0.6 + boom;
      }

      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      source.buffer = buffer;
      filter.type = 'lowpass';
      filter.frequency.value = 850;

      gain.gain.setValueAtTime(0.5 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      try { source.start(); } catch (e) {}
      return;
    }

    if (type === 'emp') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);

      gain.gain.setValueAtTime(0.4 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      try {
        osc.start();
        osc.stop(now + 0.65);
      } catch (e) {}
      return;
    }

    if (type === 'shoot') {
      // Classic Authentic Sci-Fi Laser Pew Zap
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sawtooth + Square blend for laser bite & resonance
      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Pitch sweep down for classic "PEW!" laser sound
      osc1.frequency.setValueAtTime(1600, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.09);

      osc2.frequency.setValueAtTime(800, now);
      osc2.frequency.exponentialRampToValueAtTime(110, now + 0.09);

      // Bandpass filter sweep for resonant laser chirp
      filter.type = 'bandpass';
      filter.Q.value = 2.5;
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.09);

      const vol = 0.28 * sfxVol;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      try {
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.1);
        osc2.stop(now + 0.1);
      } catch (e) {}
      return;
    }

    if (type === 'laser') {
      // High-Energy Sci-Fi Beam Cannon Zap
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      // Twin detuned high pitch sweep
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.14);

      osc2.frequency.setValueAtTime(1412, now); // Detuned for chorus thickness
      osc2.frequency.exponentialRampToValueAtTime(225, now + 0.14);

      filter.type = 'lowpass';
      filter.Q.value = 4.2; // High resonance
      filter.frequency.setValueAtTime(3800, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.14);

      gain.gain.setValueAtTime(0.26 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      try {
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
      } catch (e) {}
      return;
    }

    if (type === 'jump') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);

      gain.gain.setValueAtTime(0.25 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      try {
        osc.start();
        osc.stop(now + 0.26);
      } catch (e) {}
      return;
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'explode') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
      gain.gain.setValueAtTime(0.15 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      try { osc.start(); osc.stop(now + 0.25); } catch (e) {}
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.22);
      gain.gain.setValueAtTime(0.18 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.23);
      try { osc.start(); osc.stop(now + 0.23); } catch (e) {}
    } else if (type === 'golden') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.3);
      gain.gain.setValueAtTime(0.22 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      try { osc.start(); osc.stop(now + 0.32); } catch (e) {}
    } else if (type === 'shield_hit') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(0.2 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      try { osc.start(); osc.stop(now + 0.16); } catch (e) {}
    } else if (type === 'ufo') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.35);
      gain.gain.setValueAtTime(0.15 * sfxVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      try { osc.start(); osc.stop(now + 0.35); } catch (e) {}
    }
  }
}

export const soundEngine = new SoundEngine();
