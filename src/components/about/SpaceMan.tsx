import React from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const SpaceMan = ({ mousePosition }: { mousePosition: THREE.Vector3 }) => {
  const gltf = useLoader(GLTFLoader, "/models/spaceman/scene.gltf");
  const spacemanRef = React.useRef<any>();

  React.useEffect(() => {
    gltf.scene.scale.set(0.66, 0.66, 0.66);
    gltf.scene.position.set(2.5, -1, -2);
    gltf.scene.traverse((object: any) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  useFrame(() => {
    if (spacemanRef.current) {
      const sensitivity = 0.1;
      const targetRotationY = mousePosition.x * Math.PI * sensitivity;
      const targetRotationX = -mousePosition.y * Math.PI * sensitivity;

      spacemanRef.current.rotation.y +=
        (targetRotationY - spacemanRef.current.rotation.y) * 0.1;
      spacemanRef.current.rotation.x +=
        (targetRotationX - spacemanRef.current.rotation.x) * 0.1;
    }
  });

  return <primitive ref={spacemanRef} object={gltf.scene} />;
};

export default SpaceMan;
