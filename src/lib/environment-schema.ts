export interface EnvironmentSchema {
  id: string
  name: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean

  // Serialized scene data
  sceneData: {
    objects: {
      id: string
      type: string
      position: [number, number, number]
      rotation: [number, number, number]
      scale: [number, number, number]
      model: string
      name: string
    }[]

    sounds: {
      id: string
      name: string
      src: string
      volume: number
      loop: boolean
      playing: boolean
    }[]

    settings: {
      skybox: string
      ambientLight: number
      fogColor?: string
      fogDensity?: number
    }
  }
}

