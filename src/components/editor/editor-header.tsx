"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Share2, Play, Pause } from "lucide-react"

interface EditorHeaderProps {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
}

export default function EditorHeader({ isPlaying, setIsPlaying }: EditorHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Immersive Meditation Editor</h1>
        <Input placeholder="Untitled Environment" className="w-64" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Exit Preview
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Preview
            </>
          )}
        </Button>
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </header>
  )
}

