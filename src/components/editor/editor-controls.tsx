"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEnvironment } from "./environment-context"
import { Trash2, Move, RotateCw, Maximize } from "lucide-react"
import ModelViewer from "./model-viewer"

// Updated model list to use Cloudinary URLs for GLB files
const AVAILABLE_MODELS = [
  {
    name: "Buddha Statue",
    model: "https://res.cloudinary.com/diozithos/image/upload/v1742907475/budha_statue_iijsgt.glb",
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Maple Tree",
    model: "https://res.cloudinary.com/diozithos/image/upload/v1742906984/maple_tree_zdi3mo.glb",
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Water Animation",
    model: "https://res.cloudinary.com/diozithos/image/upload/v1742912974/water_animation_m47iom.glb",
    thumbnail: "/placeholder.svg?height=100&width=100",
  },
]

export default function EditorControls() {
  const { environment, addObject, updateObject, removeObject, selectObject } = useEnvironment()
  const [transformMode, setTransformMode] = useState<"translate" | "rotate" | "scale">("translate")

  // Add this line to expose the transformMode to the parent component
  useEffect(() => {
    // This would ideally be handled through context, but for simplicity we'll use a custom event
    const event = new CustomEvent("transformModeChange", { detail: transformMode })
    window.dispatchEvent(event)
  }, [transformMode])

  const selectedObject = environment.objects.find((obj) => obj.id === environment.selectedObjectId)

  const handleAddObject = (model: string, name: string) => {
    addObject({
      type: "model",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      model,
      name,
    })
  }

  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedObject) return

    const newPosition = [...selectedObject.position] as [number, number, number]
    newPosition[axis] = value

    updateObject(selectedObject.id, { position: newPosition })
  }

  const handleRotationChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedObject) return

    const newRotation = [...selectedObject.rotation] as [number, number, number]
    newRotation[axis] = value

    updateObject(selectedObject.id, { rotation: newRotation })
  }

  const handleScaleChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedObject) return

    const newScale = [...selectedObject.scale] as [number, number, number]
    newScale[axis] = value

    updateObject(selectedObject.id, { scale: newScale })
  }

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium mb-3">Object Library</h3>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_MODELS.map((item) => (
            <Card
              key={item.name}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleAddObject(item.model, item.name)}
            >
              <CardContent className="p-3 flex flex-col items-center">
                <ModelViewer modelPath={item.model} className="h-24 w-full mb-2" />
                <span className="text-sm font-medium">{item.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedObject && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Selected Object</h3>
            <Button variant="destructive" size="sm" onClick={() => removeObject(selectedObject.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Input
            value={selectedObject.name}
            onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
            className="mb-4"
          />

          <div className="flex space-x-2 mb-4">
            <Button
              variant={transformMode === "translate" ? "default" : "outline"}
              size="sm"
              onClick={() => setTransformMode("translate")}
              className="flex-1"
            >
              <Move className="h-4 w-4 mr-2" />
              Move
            </Button>
            <Button
              variant={transformMode === "rotate" ? "default" : "outline"}
              size="sm"
              onClick={() => setTransformMode("rotate")}
              className="flex-1"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Rotate
            </Button>
            <Button
              variant={transformMode === "scale" ? "default" : "outline"}
              size="sm"
              onClick={() => setTransformMode("scale")}
              className="flex-1"
            >
              <Maximize className="h-4 w-4 mr-2" />
              Scale
            </Button>
          </div>

          {transformMode === "translate" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>X Position: {selectedObject.position[0].toFixed(2)}</Label>
                </div>
                <Slider
                  value={[selectedObject.position[0]]}
                  min={-10}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => handlePositionChange(0, value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Y Position: {selectedObject.position[1].toFixed(2)}</Label>
                </div>
                <Slider
                  value={[selectedObject.position[1]]}
                  min={-10}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => handlePositionChange(1, value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Z Position: {selectedObject.position[2].toFixed(2)}</Label>
                </div>
                <Slider
                  value={[selectedObject.position[2]]}
                  min={-10}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => handlePositionChange(2, value[0])}
                />
              </div>
            </div>
          )}

          {transformMode === "rotate" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>X Rotation: {((selectedObject.rotation[0] * 180) / Math.PI).toFixed(0)}°</Label>
                </div>
                <Slider
                  value={[selectedObject.rotation[0]]}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  onValueChange={(value) => handleRotationChange(0, value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Y Rotation: {((selectedObject.rotation[1] * 180) / Math.PI).toFixed(0)}°</Label>
                </div>
                <Slider
                  value={[selectedObject.rotation[1]]}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  onValueChange={(value) => handleRotationChange(1, value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Z Rotation: {((selectedObject.rotation[2] * 180) / Math.PI).toFixed(0)}°</Label>
                </div>
                <Slider
                  value={[selectedObject.rotation[2]]}
                  min={-Math.PI}
                  max={Math.PI}
                  step={0.01}
                  onValueChange={(value) => handleRotationChange(2, value[0])}
                />
              </div>
            </div>
          )}

          {transformMode === "scale" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>X Scale: {selectedObject.scale[0].toFixed(2)}</Label>
                </div>
                <Slider
                  value={[selectedObject.scale[0]]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => handleScaleChange(0, value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Y Scale: {selectedObject.scale[1].toFixed(2)}</Label>
                </div>
                <Slider
                  value={[selectedObject.scale[1]]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => handleScaleChange(1, value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Z Scale: {selectedObject.scale[2].toFixed(2)}</Label>
                </div>
                <Slider
                  value={[selectedObject.scale[2]]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => handleScaleChange(2, value[0])}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedObject && environment.objects.length > 0 && (
        <div className="py-4">
          <h3 className="text-lg font-medium mb-3">Scene Objects</h3>
          <div className="space-y-2">
            {environment.objects.map((obj) => (
              <Button
                key={obj.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => selectObject(obj.id)}
              >
                {obj.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {environment.objects.length === 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <p>Add objects from the library to start building your meditation environment.</p>
        </div>
      )}
    </div>
  )
}

