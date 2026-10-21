/**
 * Procedural Web Audio API Cosmic Ambient Soundscape
 * Safe, zero-external-dependency cosmic synthesizer.
 * Disabled by default, starts only after user explicitly toggles it on.
 */

class CosmicSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying: boolean = false;
  private volume: number = 0.25;

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;
    
    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Warm space low-pass filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(3, this.ctx.currentTime);

    this.masterGain.connect(this.filter);
    this.filter.connect(this.ctx.destination);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stopOscillators();

      // Frequencies for a tranquil, expansive space chord:
      // F-fundamental (55Hz / F1), C2 (65.4Hz), A2 (110Hz), C3 (130.8Hz)
      const freqs = [55.0, 65.41, 110.0, 130.81, 164.81];

      freqs.forEach((freq, index) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Sine and triangle for velvety cosmic warmth
        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Subtle detuning for slow phasing shimmer
        osc.detune.setValueAtTime((index - 2) * 4, this.ctx.currentTime);

        const individualGain = 0.08 / (index * 0.4 + 1);
        oscGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(individualGain, this.ctx.currentTime + 3);

        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.start();
        this.oscillators.push(osc);
      });

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    this.stopOscillators();
    this.isPlaying = false;
  }

  private stopOscillators() {
    if (this.oscillators.length > 0) {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.oscillators = [];
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const cosmicAudio = new CosmicSoundEngine();
