import React from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRecoilState } from "recoil";
import { shipPositionState } from "@/components/game/lib/GameContext";

const Spaceship = ({ mousePosition }: { mousePosition: THREE.Vector3 }) => {
  const [shipPosition, setShipPosition] = useRecoilState(shipPositionState);
  const gltf = useLoader(GLTFLoader, "/models/spaceship/scene.gltf");
  const spaceshipRef = React.useRef<any>();

  React.useEffect(() => {
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, 0, -2.5);
    gltf.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  React.useEffect(() => {
    setShipPosition({
      position: {
        x: mousePosition.x * 6,
        y: mousePosition.y * 2,
        z: 0,
      },
      rotation: {
        z: -mousePosition.x * 0.5,
        x: -mousePosition.x * 0.5,
        y: -mousePosition.y * 0.2,
      },
    });
  }, [mousePosition, setShipPosition]);

  useFrame(() => {
    if (spaceshipRef.current) {
      spaceshipRef.current.rotation.z = shipPosition.rotation.z;
      spaceshipRef.current.rotation.y = shipPosition.rotation.x;
      spaceshipRef.current.rotation.x = shipPosition.rotation.y;
      spaceshipRef.current.position.y = shipPosition.position.y;
      spaceshipRef.current.position.x = shipPosition.position.x;
    }
  });

  return <primitive ref={spaceshipRef} object={gltf.scene} />;
};

export default Spaceship;
