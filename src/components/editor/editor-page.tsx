/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { Slider } from "@/components/ui/slider"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Headset } from "lucide-react"
import EditorCanvas from "./editor-canvas"
import EditorControls from "./editor-controls"
import EditorHeader from "./editor-header"
import { EnvironmentProvider } from "./environment-context"

export default function EditorPage() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <EnvironmentProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <EditorHeader isPlaying={isPlaying} setIsPlaying={setIsPlaying} />

        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            <EditorCanvas isPlaying={isPlaying} />

            {!isPlaying && (
              <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                <Button onClick={store.enterVR()}} className="flex items-center gap-2">
                  <Headset className="h-4 w-4" />
                  Enter XR
                </Button>
              </div>
            )}
          </div>

          {!isPlaying && (
            <div className="w-80 border-l bg-background p-4 overflow-y-auto">
              <Tabs defaultValue="objects">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="objects">Objects</TabsTrigger>
                  <TabsTrigger value="sounds">Sounds</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="objects">
                  <EditorControls />
                </TabsContent>
                <TabsContent value="sounds">
                  <div className="space-y-4 py-4">
                    <h3 className="text-lg font-medium">Audio Library</h3>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        🌊 Ocean Waves
                      </Button>
                      <Button variant="outline" className="justify-start">
                        🌧️ Rainfall
                      </Button>
                      <Button variant="outline" className="justify-start">
                        🔥 Crackling Fire
                      </Button>
                      <Button variant="outline" className="justify-start">
                        🌬️ Gentle Breeze
                      </Button>
                      <Button variant="outline" className="justify-start">
                        🎵 Meditation Music
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="settings">
                  <div className="space-y-4 py-4">
                    <h3 className="text-lg font-medium">Environment Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Environment</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Forest" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forest">Forest</SelectItem>
                            <SelectItem value="sunset">Sunset</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                            <SelectItem value="dawn">Dawn</SelectItem>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Ambient Light Intensity</Label>
                        <Slider defaultValue={[0.5]} min={0} max={1} step={0.1} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </EnvironmentProvider>
  )
}

// These components are needed for the settings tab
function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 font-medium">{children}</div>
}

function Select({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>
}

function SelectTrigger({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

function SelectValue({ placeholder }: { placeholder: string }) {
  return <span>{placeholder}</span>
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-input bg-background shadow-md">
      <div className="p-1">{children}</div>
    </div>
  )
}

function SelectItem({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <div className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
      {children}
    </div>
  )
}

