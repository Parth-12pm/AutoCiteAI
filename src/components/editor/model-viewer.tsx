"use client"

import { useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

interface ModelViewerProps {
  modelPath: string
  className?: string
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current)
      const center = box.getCenter(new THREE.Vector3())
      modelRef.current.position.x = -center.x
      modelRef.current.position.y = -center.y
      modelRef.current.position.z = -center.z

      // Scale the model to fit
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1.5 / maxDim
      modelRef.current.scale.set(scale, scale, scale)
    }
  }, [scene])

  return <primitive ref={modelRef} object={scene.clone()} />
}

export default function ModelViewer({ modelPath, className = "h-40 w-full" }: ModelViewerProps) {
  return (
    <div className={className}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="sunset" />
        <Model url={modelPath} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  )
}

