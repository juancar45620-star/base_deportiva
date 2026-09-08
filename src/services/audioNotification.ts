/**
 * Web Audio API synthesizer for match alerts, whistle sounds, and start/finish tones
 */

class AudioNotificationService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Sound setting preference
    const saved = localStorage.getItem('sports_sound_enabled');
    if (saved !== null) {
      this.soundEnabled = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('sports_sound_enabled', String(this.soundEnabled));
    if (this.soundEnabled) {
      this.playChime();
    }
    return this.soundEnabled;
  }

  /**
   * Play referee whistle sound (2 short trills + 1 long burst)
   */
  public playWhistle(long = false): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const playBurst = (start: number, duration: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Modulation for whistle trill
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();

      mod.frequency.setValueAtTime(32, start);
      modGain.gain.setValueAtTime(25, start);

      mod.connect(osc.frequency);
      mod.start(start);
      mod.stop(start + duration);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.01, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.03);
      gain.gain.setValueAtTime(0.25, start + duration - 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    if (long) {
      // Long final whistle: 3 bursts (tweet-tweet-tweeeet)
      playBurst(now, 0.15, 2350);
      playBurst(now + 0.22, 0.15, 2400);
      playBurst(now + 0.45, 0.7, 2300);
    } else {
      // Short whistle for match start (tweet-tweeeet)
      playBurst(now, 0.18, 2400);
      playBurst(now + 0.25, 0.45, 2300);
    }
  }

  /**
   * Play pleasant institutional chime
   */
  public playChime(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.65);
    });
  }

  /**
   * Play alert tone for warnings/cards
   */
  public playAlert(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Play celebration tone for goals / points scored in live match
   */
  public playGoal(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C5, E5, G5, C6, E6
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      gain.gain.setValueAtTime(0.18, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.45);
    });
  }
}

export const audioNotification = new AudioNotificationService();
