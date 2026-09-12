/**
 * SoundManager handles the playback of high-tech sound effects.
 * It includes a Web Audio API fallback to ensure sound is heard
 * even if external files are blocked by CORS or network firewalls.
 */

export type SoundEvent = 'SYNC_EXPAND' | 'LEVEL_UP' | 'UI_CLICK' | 'ERROR' | 'CONTEXT_MENU';

const SOUND_LIBRARY: Record<SoundEvent, string> = {
  SYNC_EXPAND: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  LEVEL_UP: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  UI_CLICK: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  ERROR: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  CONTEXT_MENU: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
};

class SoundManager {
  private audioCache: Map<SoundEvent, HTMLAudioElement> = new Map();
  private audioCtx: AudioContext | null = null;

  /**
   * Initialize AudioContext on first user interaction to bypass browser blocks.
   */
  private initAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Synthesizes a basic sci-fi beep using Web Audio API.
   * This is the "Nuclear Option" that works even if all external files are blocked.
   */
  private synthesizeFallback(event: SoundEvent) {
    if (!this.audioCtx) this.initAudioContext();
    const ctx = this.audioCtx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (event) {
      case 'UI_CLICK':
      case 'CONTEXT_MENU':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'ERROR':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'SYNC_EXPAND':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'LEVEL_UP':
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.1);
        osc.frequency.setValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
    }
  }

  playSound(event: SoundEvent): void {
    this.initAudioContext();

    try {
      console.log(`🔊 Attempting to play: ${event}`);
      let audio = this.audioCache.get(event);

      if (!audio) {
        audio = new Audio(SOUND_LIBRARY[event]);
        audio.volume = 1.0;
        this.audioCache.set(event, audio);
      }

      audio.currentTime = 0;

      audio.play()
        .then(() => {
          console.log(`✅ File sound ${event} played successfully`);
        })
        .catch(err => {
          console.warn(`❌ File sound ${event} blocked/failed. Switching to Synthesizer...`, err);
          this.synthesizeFallback(event);
        });
    } catch (error) {
      console.error(`Critical failure in SoundManager:`, error);
      this.synthesizeFallback(event);
    }
  }
}

export const soundManager = new SoundManager();
