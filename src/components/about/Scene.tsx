import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  CubeCamera,
  Environment,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  HueSaturation,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import SpaceMan from "./SpaceMan";

const Scene = () => {
  const [mousePosition, setMousePosition] = React.useState(
    new THREE.Vector3(0, 0, 0)
  );

  const handlePointerMove = (e: any) => {
    const bounds = e.target.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
    setMousePosition(new THREE.Vector3(x, y, 0));
  };

  return (
    <React.Suspense fallback={null}>
      <Canvas
        shadows
        onPointerMove={handlePointerMove}
        style={{
          position: "absolute",
          height: "125%",
          width: "100%",
          top: "0",
          left: "0",
        }}
      >
        <OrbitControls
          target={[0, 0.35, 0]}
          maxPolarAngle={1.45}
          enableZoom={false}
          enableRotate={false}
        />
        <PerspectiveCamera makeDefault fov={50} position={[4, 3, 3]} />
        <CubeCamera resolution={256} frames={Infinity}>
          {(texture) => (
            <>
              <Environment background={false} map={texture} />
              <SpaceMan mousePosition={mousePosition} />
            </>
          )}
        </CubeCamera>
        <directionalLight
          castShadow
          color={"#889293"}
          intensity={2}
          position={[10, 5, 4]}
          shadow-bias={-0.0005}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.01}
          shadow-camera-far={20}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
          shadow-camera-left={-6.2}
          shadow-camera-right={6.4}
        />
        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.ADD}
            intensity={1.5}
            width={300}
            height={300}
            kernelSize={5}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.025}
          />
          <HueSaturation
            blendFunction={BlendFunction.NORMAL}
            hue={-0.15}
            saturation={0.1}
          />
        </EffectComposer>
      </Canvas>
    </React.Suspense>
  );
};

export default Scene;
