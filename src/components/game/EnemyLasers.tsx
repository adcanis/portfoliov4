import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { v4 as uuidv4 } from "uuid";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  shipPositionState,
  enemyLaserState,
  enemyShipPositionState,
} from "./lib/GameContext";

export const EnemyLaserController = () => {
  const playerShipPosition = useRecoilValue(shipPositionState);
  const enemyShips = useRecoilValue(enemyShipPositionState);
  const [lasers, setLasers] = useRecoilState(enemyLaserState);

  useFrame(() => {
    enemyShips.forEach((enemy) => {
      if (shouldFireLaser(enemy)) {
        const direction = new THREE.Vector3(
          playerShipPosition.position.x - enemy.x,
          playerShipPosition.position.y - enemy.y,
          playerShipPosition.position.z - enemy.z
        ).normalize();

        const laserSpeed = 2;
        const velocity = direction.multiplyScalar(laserSpeed);

        const newLaser = {
          id: uuidv4(),
          x: enemy.x,
          y: enemy.y,
          z: enemy.z,
          velocity: { x: velocity.x, y: velocity.y, z: velocity.z },
        };
        setLasers((prevLasers: any) => [...prevLasers, newLaser]);
      }
    });
  });

  function shouldFireLaser(enemy: any) {
    return Math.random() < 0.01;
  }

  return null;
};

const EnemyLasers = () => {
  const [lasers, setLasers] = useRecoilState(enemyLaserState);

  useFrame(() => {
    const updatedLasers = lasers.map((laser: any) => ({
      ...laser,
      x: laser.x + laser.velocity.x,
      y: laser.y + laser.velocity.y,
      z: laser.z + laser.velocity.z,
    }));

    const lasersInBounds = updatedLasers.filter((laser) => laser.z > -10);

    setLasers(lasersInBounds);
  });

  return (
    <group>
      {lasers.map((laser) => (
        <mesh position={[laser.x, laser.y, laser.z]} key={laser.id}>
          <sphereGeometry attach="geometry" args={[0.025, 5, 5]} />
          <meshStandardMaterial
            attach="material"
            color="#ffffff"
            emissive="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
};

export default EnemyLasers;
