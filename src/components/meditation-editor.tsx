"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Sky, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  TreesIcon as Tree,
  Mountain,
  Waves,
  Wind,
  Music,
  Sun,
  Moon,
  CloudSun,
  Move,
  RotateCcw,
  Maximize,
} from "lucide-react"
import * as THREE from "three"

// Asset types
type AssetType = {
  id: string
  name: string
  icon: React.ElementType
  category: "nature" | "sound" | "lighting"
}

// Available assets
const assets: AssetType[] = [
  { id: "tree", name: "Tree", icon: Tree, category: "nature" },
  { id: "mountain", name: "Mountain", icon: Mountain, category: "nature" },
  { id: "water", name: "Water", icon: Waves, category: "nature" },
  { id: "mat", name: "Meditation Mat", icon: Maximize, category: "nature" },
  { id: "wind", name: "Wind Sound", icon: Wind, category: "sound" },
  { id: "music", name: "Ambient Music", icon: Music, category: "sound" },
  { id: "daytime", name: "Daytime", icon: Sun, category: "lighting" },
  { id: "night", name: "Night", icon: Moon, category: "lighting" },
  { id: "sunset", name: "Sunset", icon: CloudSun, category: "lighting" },
]

// Placed asset in the scene
type PlacedAsset = {
  id: string
  assetId: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

export default function MeditationEditor() {
  const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate")
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night" | "sunset">("day")
  const [ambientSound, setAmbientSound] = useState<string | null>(null)
  const [volume, setVolume] = useState<number>(50)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize with a meditation mat
  useEffect(() => {
    if (placedAssets.length === 0) {
      setPlacedAssets([
        {
          id: "default-mat",
          assetId: "mat",
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
        },
      ])
    }
  }, [placedAssets.length])

  // Handle audio playback
  useEffect(() => {
    if (ambientSound && (ambientSound === "wind" || ambientSound === "music")) {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      // Use placeholder URLs (in a real app, you'd use actual sound files)
      const soundUrl =
        ambientSound === "wind"
          ? "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3"
          : "https://assets.mixkit.co/active_storage/sfx/2452/2452-preview.mp3"

      audioRef.current.src = soundUrl
      audioRef.current.loop = true
      audioRef.current.volume = volume / 100
      audioRef.current.play().catch((e) => console.log("Audio play failed:", e))

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }
    } else if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [ambientSound, volume])

  // Handle asset selection
  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId)
  }

  // Handle placing an asset in the scene
  const handlePlaceAsset = () => {
    if (selectedAsset) {
      const newAsset: PlacedAsset = {
        id: `${selectedAsset}-${Date.now()}`,
        assetId: selectedAsset,
        position: [0, 0, -5], // Default position in front of the camera
        rotation: [0, 0, 0],
        scale: 1,
      }

      setPlacedAssets([...placedAssets, newAsset])
      setSelectedAsset(null)
    }
  }

  // Handle removing an asset from the scene
  const handleRemoveAsset = (id: string) => {
    if (selectedObject === id) {
      setSelectedObject(null)
    }
    setPlacedAssets(placedAssets.filter((asset) => asset.id !== id))
  }

  // Handle changing the time of day
  const handleTimeOfDayChange = (time: "day" | "night" | "sunset") => {
    setTimeOfDay(time)
  }

  // Handle changing the ambient sound
  const handleAmbientSoundChange = (soundId: string | null) => {
    setAmbientSound(soundId)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  // Handle entering VR mode
  const handleEnterVR = () => {
    // In a real implementation, we would use the WebXR API directly
    // For now, we'll just show an alert
    alert("VR mode would be activated here. This requires proper WebXR setup.")
  }

  // Handle object selection
  const handleObjectSelect = (id: string) => {
    setSelectedObject(id === selectedObject ? null : id)
  }

  // Handle transform mode change
  const handleTransformModeChange = (mode: "translate" | "rotate" | "scale") => {
    setTransformMode(mode)
  }

  // Handle asset position update
  const handleAssetUpdate = (
    id: string,
    newPosition: [number, number, number],
    newRotation: [number, number, number],
    newScale: number,
  ) => {
    setPlacedAssets(
      placedAssets.map((asset) =>
        asset.id === id ? { ...asset, position: newPosition, rotation: newRotation, scale: newScale } : asset,
      ),
    )
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-background border-b">
        <h1 className="text-2xl font-bold">Meditation Environment Editor</h1>
        <p className="text-muted-foreground">Create your own immersive meditation space</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 3D Scene */}
        <div className="flex-1 relative">
          <Canvas>
            <color attach="background" args={["#f0f0f0"]} />

            {/* Environment lighting based on time of day */}
            {timeOfDay === "day" && <Sky sunPosition={[0, 1, 0]} />}
            {timeOfDay === "night" && <Sky sunPosition={[0, -1, 0]} inclination={0} />}
            {timeOfDay === "sunset" && <Sky sunPosition={[1, 0.1, 0]} />}

            <Environment preset="forest" />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#91a364" />
            </mesh>

            {/* Scene with assets and controls */}
            <Scene
              assets={placedAssets}
              selectedObject={selectedObject}
              transformMode={transformMode}
              onSelect={handleObjectSelect}
              onUpdate={handleAssetUpdate}
            />

            {/* Controls */}
            <OrbitControls makeDefault />
          </Canvas>

          {/* Transform Controls UI */}
          {selectedObject && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                variant={transformMode === "translate" ? "default" : "outline"}
                size="icon"
                onClick={() => handleTransformModeChange("translate")}
                title="Move"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={transformMode === "rotate" ? "default" : "outline"}
                size="icon"
                onClick={() => handleTransformModeChange("rotate")}
                title="Rotate"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant={transformMode === "scale" ? "default" : "outline"}
                size="icon"
                onClick={() => handleTransformModeChange("scale")}
                title="Scale"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <Card className="w-80 h-full rounded-none border-l">
          <CardContent className="p-4 h-full flex flex-col">
            <Tabs defaultValue="assets" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="assets">Assets</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
                <TabsTrigger value="sound">Sound</TabsTrigger>
              </TabsList>

              {/* Assets Tab */}
              <TabsContent value="assets" className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {assets
                    .filter((asset) => asset.category === "nature")
                    .map((asset) => (
                      <Button
                        key={asset.id}
                        variant={selectedAsset === asset.id ? "default" : "outline"}
                        className="h-20 flex flex-col gap-2 items-center justify-center"
                        onClick={() => handleAssetSelect(asset.id)}
                      >
                        <asset.icon className="h-6 w-6" />
                        <span className="text-xs">{asset.name}</span>
                      </Button>
                    ))}
                </div>

                {selectedAsset && (
                  <Button className="w-full mt-4" onClick={handlePlaceAsset}>
                    Place in Scene
                  </Button>
                )}

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Placed Assets</h3>
                  {placedAssets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No assets placed yet</p>
                  ) : (
                    <ul className="space-y-2">
                      {placedAssets.map((asset) => {
                        const assetInfo = assets.find((a) => a.id === asset.assetId)
                        return (
                          <li key={asset.id} className="flex items-center justify-between">
                            <Button
                              variant={selectedObject === asset.id ? "default" : "ghost"}
                              size="sm"
                              className="flex items-center gap-2 w-full justify-start"
                              onClick={() => handleObjectSelect(asset.id)}
                            >
                              {assetInfo?.icon && <assetInfo.icon className="h-4 w-4" />}
                              <span className="text-sm">{assetInfo?.name}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </TabsContent>

              {/* Environment Tab */}
              <TabsContent value="environment" className="flex-1 overflow-auto">
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Time of Day</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={timeOfDay === "day" ? "default" : "outline"}
                      className="flex flex-col gap-2 items-center justify-center"
                      onClick={() => handleTimeOfDayChange("day")}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-xs">Day</span>
                    </Button>
                    <Button
                      variant={timeOfDay === "sunset" ? "default" : "outline"}
                      className="flex flex-col gap-2 items-center justify-center"
                      onClick={() => handleTimeOfDayChange("sunset")}
                    >
                      <CloudSun className="h-6 w-6" />
                      <span className="text-xs">Sunset</span>
                    </Button>
                    <Button
                      variant={timeOfDay === "night" ? "default" : "outline"}
                      className="flex flex-col gap-2 items-center justify-center"
                      onClick={() => handleTimeOfDayChange("night")}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-xs">Night</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Sound Tab */}
              <TabsContent value="sound" className="flex-1 overflow-auto">
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Ambient Sounds</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {assets
                      .filter((asset) => asset.category === "sound")
                      .map((asset) => (
                        <Button
                          key={asset.id}
                          variant={ambientSound === asset.id ? "default" : "outline"}
                          className="h-20 flex flex-col gap-2 items-center justify-center"
                          onClick={() => handleAmbientSoundChange(asset.id)}
                        >
                          <asset.icon className="h-6 w-6" />
                          <span className="text-xs">{asset.name}</span>
                        </Button>
                      ))}
                    <Button
                      variant={ambientSound === null ? "default" : "outline"}
                      className="h-20 flex flex-col gap-2 items-center justify-center"
                      onClick={() => handleAmbientSoundChange(null)}
                    >
                      <span className="text-xs">No Sound</span>
                    </Button>
                  </div>

                  {ambientSound && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Volume: {volume}%</h3>
                      <Slider value={[volume]} max={100} step={1} onValueChange={handleVolumeChange} />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-auto pt-4 border-t">
              <Button className="w-full" onClick={handleEnterVR}>
                Enter VR Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Scene component that handles all 3D objects and transformations
function Scene({
  assets,
  selectedObject,
  transformMode,
  onSelect,
  onUpdate,
}: {
  assets: PlacedAsset[]
  selectedObject: string | null
  transformMode: "translate" | "rotate" | "scale"
  onSelect: (id: string) => void
  onUpdate: (id: string, position: [number, number, number], rotation: [number, number, number], scale: number) => void
}) {
  // Use a manual approach for transformations instead of TransformControls
  const selectedRef = useRef<THREE.Object3D | null>(null)
  const startPos = useRef<THREE.Vector3 | null>(null)
  const startRot = useRef<THREE.Euler | null>(null)
  const startScale = useRef<number | null>(null)
  const isDragging = useRef(false)
  const { camera, raycaster, gl, scene } = useThree()
  const mouse = useRef(new THREE.Vector2())
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0)))
  const planeIntersection = useRef(new THREE.Vector3())

  // Handle mouse movement for transformations
  useFrame(() => {
    if (isDragging.current && selectedRef.current && startPos.current) {
      if (transformMode === "translate") {
        // Simple drag-and-drop on a plane
        raycaster.setFromCamera(mouse.current, camera)
        if (raycaster.ray.intersectPlane(plane.current, planeIntersection.current)) {
          selectedRef.current.position.copy(planeIntersection.current)
          if (selectedRef.current.position.y < 0) {
            selectedRef.current.position.y = 0
          }
        }
      } else if (transformMode === "rotate" && startRot.current) {
        // Rotate based on mouse X movement
        selectedRef.current.rotation.y = startRot.current.y + mouse.current.x * 5
      } else if (transformMode === "scale" && startScale.current) {
        // Scale based on mouse Y movement
        const newScale = startScale.current * (1 + mouse.current.y)
        selectedRef.current.scale.set(newScale, newScale, newScale)
      }
    }
  })

  // Set up event listeners
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (selectedRef.current) {
        isDragging.current = true
        mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1
        mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1

        startPos.current = selectedRef.current.position.clone()
        startRot.current = selectedRef.current.rotation.clone()
        startScale.current = selectedRef.current.scale.x

        // Update the plane to be perpendicular to the camera
        const normal = new THREE.Vector3(0, 1, 0)
        plane.current.setFromNormalAndCoplanarPoint(normal, selectedRef.current.position)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / gl.domElement.clientWidth) * 2 - 1
      mouse.current.y = -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    }

    const handleMouseUp = () => {
      if (isDragging.current && selectedRef.current && selectedObject) {
        isDragging.current = false

        // Update the parent component with the new transform
        onUpdate(
          selectedObject,
          selectedRef.current.position.toArray() as [number, number, number],
          [selectedRef.current.rotation.x, selectedRef.current.rotation.y, selectedRef.current.rotation.z] as [
            number,
            number,
            number,
          ],
          selectedRef.current.scale.x,
        )
      }
    }

    gl.domElement.addEventListener("mousedown", handleMouseDown)
    gl.domElement.addEventListener("mousemove", handleMouseMove)
    gl.domElement.addEventListener("mouseup", handleMouseUp)

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown)
      gl.domElement.removeEventListener("mousemove", handleMouseMove)
      gl.domElement.removeEventListener("mouseup", handleMouseUp)
    }
  }, [gl, selectedObject, onUpdate, camera, raycaster, transformMode])

  return (
    <>
      {assets.map((asset) => {
        const isSelected = selectedObject === asset.id

        // Create a ref for the selected object
        const ref = isSelected ? selectedRef : null

        // Render the appropriate asset based on type
        switch (asset.assetId) {
          case "tree":
            return (
              <group
                key={asset.id}
                position={asset.position}
                rotation={asset.rotation as any}
                scale={asset.scale}
                ref={ref}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(asset.id)
                }}
              >
                {/* Tree trunk */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
                {/* Tree foliage */}
                <mesh position={[0, 1.5, 0]} castShadow>
                  <coneGeometry args={[1, 2, 8]} />
                  <meshStandardMaterial color="#2E8B57" />
                </mesh>
                {isSelected && (
                  <mesh position={[0, 0, 0]} visible={false}>
                    <boxGeometry args={[2, 3, 2]} />
                    <meshBasicMaterial color="red" wireframe opacity={0.5} transparent />
                  </mesh>
                )}
              </group>
            )
          case "mountain":
            return (
              <group
                key={asset.id}
                position={asset.position}
                rotation={asset.rotation as any}
                scale={asset.scale}
                ref={ref}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(asset.id)
                }}
              >
                <mesh castShadow>
                  <coneGeometry args={[2, 4, 4]} />
                  <meshStandardMaterial color="#808080" />
                </mesh>
                {isSelected && (
                  <mesh position={[0, 0, 0]} visible={false}>
                    <boxGeometry args={[4, 4, 4]} />
                    <meshBasicMaterial color="red" wireframe opacity={0.5} transparent />
                  </mesh>
                )}
              </group>
            )
          case "water":
            return (
              <group
                key={asset.id}
                position={asset.position}
                rotation={asset.rotation as any}
                scale={asset.scale}
                ref={ref}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(asset.id)
                }}
              >
                <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[4, 4, 32, 32]} />
                  <meshStandardMaterial color="#4169E1" transparent opacity={0.8} />
                </mesh>
                {isSelected && (
                  <mesh position={[0, -0.4, 0]} visible={false}>
                    <boxGeometry args={[4, 0.1, 4]} />
                    <meshBasicMaterial color="red" wireframe opacity={0.5} transparent />
                  </mesh>
                )}
              </group>
            )
          case "mat":
            return (
              <group
                key={asset.id}
                position={asset.position}
                rotation={asset.rotation as any}
                scale={asset.scale}
                ref={ref}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect(asset.id)
                }}
              >
                <mesh receiveShadow>
                  <cylinderGeometry args={[1, 1, 0.05, 32]} />
                  <meshStandardMaterial color="#8b5a2b" />
                </mesh>
                {isSelected && (
                  <mesh position={[0, 0.1, 0]} visible={false}>
                    <cylinderGeometry args={[1.1, 1.1, 0.2, 32]} />
                    <meshBasicMaterial color="red" wireframe opacity={0.5} transparent />
                  </mesh>
                )}
              </group>
            )
          default:
            return null
        }
      })}
    </>
  )
}

