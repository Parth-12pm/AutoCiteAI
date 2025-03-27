"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  Sky,
  Environment,
} from "@react-three/drei";
import { XR, Interactive, useXR } from "@react-three/xr";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Group, Object3D, Object3DEventMap, Intersection } from "three";
import { createXRStore } from "@react-three/xr";

// Create an XR store (required for XR component)
const xrStore = createXRStore();

// Asset loader component
function AssetLoader({
  url,
  position,
  scale,
  rotation,
  onLoad,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  onLoad: (obj: THREE.Group) => void; // Made this required to fix the error
}) {
  const objRef = useRef<Group>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      url,
      (obj: THREE.Group) => {
        if (objRef.current) {
          objRef.current.add(obj);
          setLoaded(true);
          onLoad(obj);
        }
      },
      undefined,
      (error: unknown) => {
        console.error("An error happened during loading:", error);
      }
    );
  }, [url, onLoad]);

  return (
    <group
      ref={objRef}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  );
}

// Scene component
function Scene({
  selectedObject,
  transformMode,
  onObjectSelect,
}: {
  selectedObject: string | null;
  transformMode: "translate" | "rotate" | "scale";
  onObjectSelect: (id: string) => void;
}) {
  const controlsRef = useRef(null);

  // Check if in VR mode using the useXR hook
  const session = useXR((state) => state.session);
  const isVR = !!session;

  // Sample objects
  const objects = useMemo<
    Array<{
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
      scale: number;
    }>
  >(
    () => [
      { id: "tree", position: [0, 0, -5], rotation: [0, 0, 0], scale: 1 },
      { id: "rock", position: [3, 0, -12], rotation: [0, 0, 0], scale: 0.8 },
    ],
    []
  );

  // Find the selected object
  const selectedObjectData = objects.find((obj) => obj.id === selectedObject);

  // References to objects
  const objectRefs = useRef<{ [key: string]: THREE.Group | null }>({});

  // Set up object refs
  useEffect(() => {
    objects.forEach((obj) => {
      if (!objectRefs.current[obj.id]) {
        objectRefs.current[obj.id] = null;
      }
    });
  }, [objects]);

  // Handle object selection - fixed type signature
  const handleSelect =
    (id: string) =>
    (event: {
      intersection: Intersection<Object3D<Object3DEventMap>>;
      intersections: Intersection<Object3D<Object3DEventMap>>[];
      target: Object3D<Object3DEventMap>;
    }) => {
      onObjectSelect(id);
    };

  return (
    <>
      {/* Environment */}
      <Sky sunPosition={[0, 1, 0]} />
      <Environment preset="forest" />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#91a364" />
      </mesh>

      {/* Objects */}
      {objects.map((obj) => (
        <Interactive key={obj.id} onSelect={handleSelect(obj.id)}>
          <group
            ref={(el) => {
              objectRefs.current[obj.id] = el;
            }}
            position={obj.position}
            rotation={obj.rotation as [number, number, number]}
            scale={[obj.scale, obj.scale, obj.scale]}
          >
            {/* Simple placeholder geometry */}
            {obj.id === "tree" ? (
              <>
                <mesh castShadow>
                  <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
                <mesh position={[0, 1.5, 0]} castShadow>
                  <coneGeometry args={[1, 2, 8]} />
                  <meshStandardMaterial color="#2E8B57" />
                </mesh>
              </>
            ) : (
              <mesh castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#888888" />
              </mesh>
            )}

            {/* Highlight selected object */}
            {selectedObject === obj.id && (
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <meshBasicMaterial
                  color="red"
                  wireframe
                  opacity={0.5}
                  transparent
                />
              </mesh>
            )}
          </group>
        </Interactive>
      ))}

      {/* Transform controls for selected object */}
      {selectedObject && !isVR && selectedObjectData && (
        <TransformControls
          object={
            objectRefs.current[selectedObject] as unknown as React.RefObject<
              Object3D<Object3DEventMap>
            >
          }
          mode={transformMode}
          onChange={() => {
            // Update object position in your state if needed
          }}
        />
      )}

      {/* Camera controls */}
      {!isVR && <OrbitControls makeDefault />}
    </>
  );
}

// Main component
export default function EditorCanvas() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<
    "translate" | "rotate" | "scale"
  >("translate");

  // Handle object selection
  const handleObjectSelect = (id: string) => {
    setSelectedObject(id === selectedObject ? null : id);
  };

  return (
    <div className="relative w-full h-full">
      {/* Transform Controls UI */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <button
          className={`px-3 py-2 rounded ${
            transformMode === "translate"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setTransformMode("translate")}
        >
          Move
        </button>
        <button
          className={`px-3 py-2 rounded ${
            transformMode === "rotate"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setTransformMode("rotate")}
        >
          Rotate
        </button>
        <button
          className={`px-3 py-2 rounded ${
            transformMode === "scale" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTransformMode("scale")}
        >
          Scale
        </button>
      </div>

      {/* Using regular Canvas with XR component */}
      <Canvas className="w-full h-full">
        <XR store={xrStore}>
          <Scene
            selectedObject={selectedObject}
            transformMode={transformMode}
            onObjectSelect={handleObjectSelect}
          />
        </XR>
      </Canvas>
    </div>
  );
}
