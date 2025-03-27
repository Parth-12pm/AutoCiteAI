export class AudioManager {
  private audioElements: Map<string, HTMLAudioElement> = new Map()

  constructor() {}

  loadSound(id: string, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(src)

      audio.addEventListener(
        "canplaythrough",
        () => {
          this.audioElements.set(id, audio)
          resolve()
        },
        { once: true },
      )

      audio.addEventListener("error", (err) => {
        reject(err)
      })

      audio.load()
    })
  }

  play(id: string, options?: { loop?: boolean; volume?: number }): void {
    const audio = this.audioElements.get(id)
    if (!audio) return

    if (options?.loop !== undefined) {
      audio.loop = options.loop
    }

    if (options?.volume !== undefined) {
      audio.volume = options.volume
    }

    audio.play()
  }

  pause(id: string): void {
    const audio = this.audioElements.get(id)
    if (!audio) return

    audio.pause()
  }

  stop(id: string): void {
    const audio = this.audioElements.get(id)
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
  }

  setVolume(id: string, volume: number): void {
    const audio = this.audioElements.get(id)
    if (!audio) return

    audio.volume = Math.max(0, Math.min(1, volume))
  }

  unload(id: string): void {
    const audio = this.audioElements.get(id)
    if (!audio) return

    audio.pause()
    audio.src = ""
    this.audioElements.delete(id)
  }

  unloadAll(): void {
    for (const id of this.audioElements.keys()) {
      this.unload(id)
    }
  }
}

export const audioManager = new AudioManager()

