/**
 * Authentic Mercedes-AMG V8 Cold Start Audio Engine
 * Uses Web Audio API with decoded audio buffer for 100% reliable, instant,
 * uncompressed-quality playback on both desktop localhost and mobile devices.
 * Zero-load impact: audio is ONLY fetched when user physically clicks the button.
 */

class V8AudioEngine {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private fallbackAudio: HTMLAudioElement | null = null;
  private isRunning: boolean = false;
  private onEndCallbacks: Set<() => void> = new Set();
  private onStateCallbacks: Set<(playing: boolean) => void> = new Set();
  private isDecoding: boolean = false;

  private notifyState(playing: boolean): void {
    this.isRunning = playing;
    this.onStateCallbacks.forEach((cb) => cb(playing));
  }

  public onEnded(callback: () => void): () => void {
    this.onEndCallbacks.add(callback);
    return () => this.onEndCallbacks.delete(callback);
  }

  public onStateChange(callback: (playing: boolean) => void): () => void {
    this.onStateCallbacks.add(callback);
    return () => this.onStateCallbacks.delete(callback);
  }

  public async start(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    try {
      // 1. Primary: Web Audio API (instant, high-impact, bypasses iOS silent switch)
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (AudioCtx) {
        if (!this.audioContext || this.audioContext.state === "closed") {
          this.audioContext = new AudioCtx();
        }

        if (this.audioContext.state === "suspended") {
          await this.audioContext.resume();
        }

        // Lazy fetch on first user click only (cached in RAM thereafter)
        if (!this.audioBuffer && !this.isDecoding) {
          this.isDecoding = true;
          try {
            const res = await fetch("/audio/amg-v8-cold-start.mp3");
            const arrayBuffer = await res.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          } finally {
            this.isDecoding = false;
          }
        }

        if (this.audioBuffer) {
          // Stop any previous instance if already active
          if (this.currentSource) {
            try {
              this.currentSource.stop();
              this.currentSource.disconnect();
            } catch {}
          }

          const source = this.audioContext.createBufferSource();
          source.buffer = this.audioBuffer;

          const gainNode = this.audioContext.createGain();
          gainNode.gain.value = 1.0;

          source.connect(gainNode);
          gainNode.connect(this.audioContext.destination);

          source.onended = () => {
            this.currentSource = null;
            this.notifyState(false);
            this.onEndCallbacks.forEach((cb) => cb());
          };

          source.start(0);
          this.currentSource = source;
          this.notifyState(true);
          return true;
        }
      }

      // 2. Fallback: Native HTML5 Audio
      if (!this.fallbackAudio) {
        const audio = new Audio("/audio/amg-v8-cold-start.mp3");
        audio.preload = "auto";
        audio.volume = 1.0;
        audio.addEventListener("ended", () => {
          this.notifyState(false);
          this.onEndCallbacks.forEach((cb) => cb());
        });
        this.fallbackAudio = audio;
      }

      this.fallbackAudio.currentTime = 0;
      await this.fallbackAudio.play();
      this.notifyState(true);
      return true;
    } catch (err) {
      console.error("[V8AudioEngine] Playback error:", err);
      this.notifyState(false);
      return false;
    }
  }

  public stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {}
      this.currentSource = null;
    }
    if (this.fallbackAudio) {
      try {
        this.fallbackAudio.pause();
        this.fallbackAudio.currentTime = 0;
      } catch {}
    }
    this.notifyState(false);
    this.onEndCallbacks.forEach((cb) => cb());
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

// Singleton getter ensuring client-side instantiation
let engineInstance: V8AudioEngine | null = null;

export function getV8AudioEngine(): V8AudioEngine {
  if (!engineInstance) {
    engineInstance = new V8AudioEngine();
  }
  return engineInstance;
}

// Backward-compatible named export
export const v8Audio = typeof window !== "undefined" ? getV8AudioEngine() : ({} as V8AudioEngine);
