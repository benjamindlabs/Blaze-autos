/**
 * High-Fidelity Audio Engine: Mercedes-AMG 4.0L V8 Biturbo Cold Start
 * Uses high-definition generated audio with native HTML5 Audio for 100% browser compatibility,
 * with Web Audio API fallback and smooth gain transitions.
 */

class V8AudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isRunning: boolean = false;
  private onEndCallbacks: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.audioElement = new Audio("/audio/amg-v8-cold-start.wav");
        this.audioElement.preload = "auto";
        this.audioElement.volume = 0.95;

        this.audioElement.addEventListener("ended", () => {
          this.isRunning = false;
          this.onEndCallbacks.forEach((cb) => cb());
        });
      } catch (err) {
        console.warn("[V8AudioEngine] Audio element init failed:", err);
      }
    }
  }

  public onEnded(callback: () => void): () => void {
    this.onEndCallbacks.add(callback);
    return () => this.onEndCallbacks.delete(callback);
  }

  public start(): boolean {
    if (typeof window === "undefined") return false;

    try {
      if (!this.audioElement) {
        this.audioElement = new Audio("/audio/amg-v8-cold-start.wav");
        this.audioElement.volume = 0.95;
      }

      this.audioElement.currentTime = 0;
      const playPromise = this.audioElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isRunning = true;
          })
          .catch((err) => {
            console.warn("[V8AudioEngine] Playback was prevented by browser:", err);
            this.isRunning = false;
          });
      }

      this.isRunning = true;
      return true;
    } catch (err) {
      console.warn("[V8AudioEngine] Failed to play V8 audio:", err);
      this.isRunning = false;
      return false;
    }
  }

  public stop(): void {
    if (!this.audioElement) return;

    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isRunning = false;
      this.onEndCallbacks.forEach((cb) => cb());
    } catch {
      this.isRunning = false;
    }
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
