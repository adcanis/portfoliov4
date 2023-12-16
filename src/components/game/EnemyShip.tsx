import React from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useRecoilValue } from "recoil";
import { enemyShipPositionState } from "@/components/game/lib/GameContext";
import { v4 as uuidv4 } from "uuid";

const EnemyShip = () => {
  const gltf = useLoader(GLTFLoader, "/models/enemy/scene.gltf");
  const enemyShips = useRecoilValue(enemyShipPositionState);

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
      {enemyShips.map((enemy) => {
        const enemyClone = gltf.scene.clone();
        enemyClone.rotation.y = Math.PI;
        return (
          <primitive
            key={uuidv4()}
            object={enemyClone}
            position={[enemy.x, enemy.y, enemy.z]}
          />
        );
      })}
    </group>
  );
};

export default EnemyShip;
