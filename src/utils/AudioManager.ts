class AudioManager {
  private audioCache: Map<string, HTMLAudioElement>;
  private isDev: boolean;

  constructor() {
    this.audioCache = new Map<string, HTMLAudioElement>();
    this.isDev = process.env.NODE_ENV === "development";
  }

  getPath(relativePath: string): string {
    // Adjust path based on environment
    return this.isDev ? relativePath : `.${relativePath}`;
  }

  async preloadAudio(path: string): Promise<HTMLAudioElement | null> {
    if (this.audioCache.has(path)) {
      return this.audioCache.get(path) || null;
    }

    try {
      const audio = new Audio(this.getPath(path));

      // Wait for audio to be loaded
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener("canplaythrough", () => resolve());
        audio.addEventListener("error", (e) => {
          console.error(`Failed to load audio: ${path}`, e);
          reject(e);
        });

        // Manually load the audio
        audio.load();
      });

      this.audioCache.set(path, audio);
      return audio;
    } catch (error) {
      console.error(`Error preloading audio: ${path}`, error);
      return null;
    }
  }

  async play(path: string): Promise<void> {
    try {
      const audio = await this.preloadAudio(path);
      if (!audio) return Promise.resolve();

      audio.currentTime = 0;
      await audio.play();

      return new Promise<void>((resolve) => {
        audio.onended = () => resolve();
      });
    } catch (error) {
      console.error(`Error playing audio: ${path}`, error);
      return Promise.resolve();
    }
  }
}

export const audioManager = new AudioManager();
