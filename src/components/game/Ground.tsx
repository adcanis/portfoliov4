import React from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";

const Ground = () => {
  const ref = React.useRef<any>();
  const [roughness, normal] = useLoader(THREE.TextureLoader, [
    "/textures/terrain-roughness.jpg",
    "/textures/terrain-normal.jpg",
  ]);

  React.useEffect(() => {
    [normal, roughness].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(100, 100);
    });

    normal.repeat.set(100, 100);
  }, [normal, roughness]);

  useFrame(() => {
    ref.current.position.z += 0.4;
  });

  return (
    <mesh
      visible
      position={[0, -25, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={ref}
      castShadow
      receiveShadow
    >
      <planeGeometry attach="geometry" args={[5000, 5000, 128, 128]} />
      <MeshReflectorMaterial
        envMapIntensity={0}
        normalMap={normal}
        roughnessMap={roughness}
        dithering={true}
        color={"#889293"}
        roughness={0.7}
        mirror={0}
        blur={[1000, 400]}
        depthScale={0.01}
        depthToBlurRatioBias={0.25}
        reflectorOffset={0.2}
      />
    </mesh>
  );
};

export default Ground;
