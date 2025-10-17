/**
 * Retro game sound effects using Web Audio API
 * Generates sounds synthetically without audio files
 */

class GameAudio {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  /**
   * Play a simple beep tone
   */
  private playTone(frequency: number, duration: number, type: OscillatorType = 'square', volume: number = 0.3) {
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.value = volume;

      const now = ctx.currentTime;
      oscillator.start(now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      oscillator.stop(now + duration);
    } catch (e) {
      // Silently fail if audio context is not supported
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * Snake eats food - cheerful beep
   */
  eatFood() {
    this.playTone(800, 0.1, 'square', 0.2);
    setTimeout(() => this.playTone(1000, 0.08, 'square', 0.15), 50);
  }

  /**
   * Snake moves - very subtle tick
   */
  move() {
    this.playTone(200, 0.02, 'square', 0.05);
  }

  /**
   * Game over - descending sad tone
   */
  gameOver() {
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      const now = ctx.currentTime;
      
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.5);
      
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * Game start - uplifting beep
   */
  gameStart() {
    this.playTone(400, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(600, 0.15, 'sine', 0.2), 80);
  }
}

export const gameAudio = new GameAudio();
