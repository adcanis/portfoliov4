import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRecoilValue } from "recoil";
import { meteorPositionState } from "@/components/game/lib/GameContext";
import { v4 as uuidv4 } from "uuid";

const Meteor = () => {
  const gltf = useLoader(GLTFLoader, "/models/meteor/scene.gltf");
  const meteors = useRecoilValue(meteorPositionState);

  React.useEffect(() => {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.traverse((object: any) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 20;
      }
    });
  }, [gltf]);

  return (
    <group>
      {meteors.map((meteor) => (
        <primitive
          key={uuidv4()}
          object={gltf.scene.clone()}
          position={[meteor.x, meteor.y, meteor.z]}
        />
      ))}
    </group>
  );
};

export default Meteor;
