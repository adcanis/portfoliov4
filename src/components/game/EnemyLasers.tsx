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

        console.log("fired laser");
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
  const playerShipPosition = useRecoilValue(shipPositionState);

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
      {lasers.map((laser) => {
        // Calculate the direction and length of the laser
        const targetPosition = new THREE.Vector3(
          playerShipPosition.position.x,
          playerShipPosition.position.y,
          playerShipPosition.position.z
        );
        const laserPosition = new THREE.Vector3(laser.x, laser.y, laser.z);
        const direction = new THREE.Vector3().subVectors(
          targetPosition,
          laserPosition
        );
        const length = direction.length();

        // Create a rotation quaternion to align the cylinder with the direction
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize()
        );

        return (
          <mesh
            position={[laser.x, laser.y, laser.z]}
            quaternion={quaternion}
            key={laser.id}
          >
            <cylinderGeometry
              attach="geometry"
              args={[0.05, 0.05, length, 8, 1, false, 0, Math.PI * 2]}
            />
            <meshStandardMaterial
              attach="material"
              color="#ff0000"
              emissive="#ff0000"
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default EnemyLasers;
