class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startVol = 0.15, endVol = 0.001) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio play error fallback
    }
  }

  public playMove() {
    this.playTone(180, 'triangle', 0.04, 0.08);
  }

  public playRotate() {
    this.playTone(440, 'sine', 0.08, 0.12);
  }

  public playSoftDrop() {
    this.playTone(220, 'sine', 0.03, 0.05);
  }

  public playHardDrop() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Fallback
    }
  }

  public playHold() {
    this.playTone(523.25, 'sine', 0.09, 0.15); // C5
  }

  public playLineClear(linesCount: number) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseFreqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const count = Math.min(linesCount, 4);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this.playTone(baseFreqs[i] || 523.25, 'triangle', 0.18, 0.2);
      }, i * 60);
    }
  }

  public playGameOver() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [400, 350, 300, 250, 200];
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sawtooth', 0.2, 0.18);
      }, idx * 120);
    });
  }
}

export const soundManager = new SoundManager();
