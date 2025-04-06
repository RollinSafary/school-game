// SimplifiedAudioManager.ts

// A very simple audio player that only allows one sound at a time
class SimplifiedAudioManager {
  private currentAudio: HTMLAudioElement | null;
  private isPlaying: boolean;
  private isDev: boolean;

  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
    this.isDev = process.env.NODE_ENV === "development";
  }

  // Stop any currently playing audio
  stopAll(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.isPlaying = false;
    }
  }

  // Normalize path for cross-platform compatibility
  normalizePath(path: string): string {
    // Ensure path starts with ./ in production but not in development
    if (path.startsWith("/")) {
      return this.isDev ? path : `.${path}`;
    }
    return path;
  }

  // Play a sound file
  play(path: string): Promise<void> {
    // First stop any current playback
    this.stopAll();

    // Normalize the path for cross-platform compatibility
    const normalizedPath = this.normalizePath(path);

    return new Promise<void>((resolve, reject) => {
      try {
        // Create a new audio element each time to avoid state issues
        const audio = new Audio(normalizedPath);

        // Set up listeners before playing
        audio.addEventListener(
          "ended",
          () => {
            this.isPlaying = false;
            this.currentAudio = null;
            resolve();
          },
          { once: true }
        );

        audio.addEventListener(
          "error",
          (e: Event) => {
            console.error(`Error playing ${normalizedPath}:`, e);
            this.isPlaying = false;
            this.currentAudio = null;
            reject(e);
          },
          { once: true }
        );

        // Save reference and play
        this.currentAudio = audio;
        this.isPlaying = true;

        audio.play().catch((err) => {
          console.error(`Error playing ${normalizedPath}:`, err);
          this.isPlaying = false;
          this.currentAudio = null;
          reject(err);
        });
      } catch (err) {
        console.error(`Error setting up audio for ${normalizedPath}:`, err);
        this.isPlaying = false;
        this.currentAudio = null;
        reject(err);
      }
    });
  }
}

export const simpleAudioManager = new SimplifiedAudioManager();
