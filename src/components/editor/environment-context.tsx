"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type ObjectType = {
  id: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  model: string
  name: string
}

export type SoundType = {
  id: string
  name: string
  src: string
  volume: number
  loop: boolean
  playing: boolean
}

export type EnvironmentType = {
  name: string
  objects: ObjectType[]
  sounds: SoundType[]
  selectedObjectId: string | null
}

type EnvironmentContextType = {
  environment: EnvironmentType
  setEnvironment: (env: EnvironmentType) => void
  addObject: (object: Omit<ObjectType, "id">) => void
  updateObject: (id: string, updates: Partial<ObjectType>) => void
  removeObject: (id: string) => void
  selectObject: (id: string | null) => void
  addSound: (sound: Omit<SoundType, "id">) => void
  updateSound: (id: string, updates: Partial<SoundType>) => void
  removeSound: (id: string) => void
}

const defaultEnvironment: EnvironmentType = {
  name: "Untitled Environment",
  objects: [],
  sounds: [],
  selectedObjectId: null,
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined)

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<EnvironmentType>(defaultEnvironment)

  const addObject = (object: Omit<ObjectType, "id">) => {
    const newObject = {
      ...object,
      id: crypto.randomUUID(),
    }

    setEnvironment((prev) => ({
      ...prev,
      objects: [...prev.objects, newObject],
      selectedObjectId: newObject.id,
    }))
  }

  const updateObject = (id: string, updates: Partial<ObjectType>) => {
    setEnvironment((prev) => ({
      ...prev,
      objects: prev.objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    }))
  }

  const removeObject = (id: string) => {
    setEnvironment((prev) => ({
      ...prev,
      objects: prev.objects.filter((obj) => obj.id !== id),
      selectedObjectId: prev.selectedObjectId === id ? null : prev.selectedObjectId,
    }))
  }

  const selectObject = (id: string | null) => {
    setEnvironment((prev) => ({
      ...prev,
      selectedObjectId: id,
    }))
  }

  const addSound = (sound: Omit<SoundType, "id">) => {
    const newSound = {
      ...sound,
      id: crypto.randomUUID(),
    }

    setEnvironment((prev) => ({
      ...prev,
      sounds: [...prev.sounds, newSound],
    }))
  }

  const updateSound = (id: string, updates: Partial<SoundType>) => {
    setEnvironment((prev) => ({
      ...prev,
      sounds: prev.sounds.map((sound) => (sound.id === id ? { ...sound, ...updates } : sound)),
    }))
  }

  const removeSound = (id: string) => {
    setEnvironment((prev) => ({
      ...prev,
      sounds: prev.sounds.filter((sound) => sound.id !== id),
    }))
  }

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        addObject,
        updateObject,
        removeObject,
        selectObject,
        addSound,
        updateSound,
        removeSound,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext)
  if (context === undefined) {
    throw new Error("useEnvironment must be used within an EnvironmentProvider")
  }
  return context
}

