// SimplifiedAudioManager.js

// A very simple audio player that only allows one sound at a time
class SimplifiedAudioManager {
  constructor() {
    this.currentAudio = null;
    this.isPlaying = false;
  }

  // Stop any currently playing audio
  stopAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.isPlaying = false;
    }
  }

  // Play a sound file
  play(path) {
    // First stop any current playback
    this.stopAll();

    return new Promise((resolve, reject) => {
      try {
        // Create a new audio element each time to avoid state issues
        const audio = new Audio(path);

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
          (e) => {
            console.error(`Error playing ${path}:`, e);
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
          console.error(`Error playing ${path}:`, err);
          this.isPlaying = false;
          this.currentAudio = null;
          reject(err);
        });
      } catch (err) {
        console.error(`Error setting up audio for ${path}:`, err);
        this.isPlaying = false;
        this.currentAudio = null;
        reject(err);
      }
    });
  }
}

export const simpleAudioManager = new SimplifiedAudioManager();
