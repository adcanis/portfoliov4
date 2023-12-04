import React from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Globe = ({ mousePosition }: { mousePosition: THREE.Vector3 }) => {
  const globeRef = React.useRef<any>();
  const gltf = useLoader(GLTFLoader, "/models/globe/scene.gltf");

  React.useEffect(() => {
    gltf.scene.scale.set(1.75, 1.75, 1.75);
    gltf.scene.position.set(0, 1, 1);
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  useFrame(() => {
    if (globeRef.current) {
      const sensitivity = 0.1;
      const targetRotationY = mousePosition.x * Math.PI * sensitivity;
      const targetRotationX = -mousePosition.y * Math.PI * sensitivity;

      globeRef.current.rotation.y +=
        (targetRotationY - globeRef.current.rotation.y) * 0.1;
      globeRef.current.rotation.x +=
        (targetRotationX - globeRef.current.rotation.x) * 0.1;
    }
  });

  return <primitive ref={globeRef} object={gltf.scene} />;
};

export default Globe;
