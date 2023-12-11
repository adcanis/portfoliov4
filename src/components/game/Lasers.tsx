import React from "react";
import * as THREE from "three";
import { useRecoilState, useRecoilValue } from "recoil";
import { laserPositionState, shipPositionState } from "./lib/GameContext";
import { v4 as uuidv4 } from "uuid";

export const LaserController = ({
  mousePosition,
}: {
  mousePosition: THREE.Vector3;
}) => {
  const shipPosition = useRecoilValue(shipPositionState);
  const [lasers, setLasers] = useRecoilState(laserPositionState);

  const handleClick = () => {
    const calculatedTargetPosition = new THREE.Vector3(
      mousePosition.x * 6,
      mousePosition.y * 2 + 3.33,
      -5
    );

    // calculate the direction vector that goes from ship to target
    const laserDirection = new THREE.Vector3()
      .subVectors(
        calculatedTargetPosition,
        new THREE.Vector3(
          shipPosition.position.x,
          shipPosition.position.y,
          shipPosition.position.z
        )
      )
      .normalize();

    const speed = 6;
    const offsetMultiplier = 1;
    laserDirection.multiplyScalar(speed);

    // initialize laser slightly ahead of ship
    const laserOffset = new THREE.Vector3().addVectors(
      new THREE.Vector3(
        shipPosition.position.x,
        shipPosition.position.y,
        shipPosition.position.z
      ),
      laserDirection.clone().multiplyScalar(offsetMultiplier)
    );

    const laser = {
      id: uuidv4(),
      x: laserOffset.x,
      y: laserOffset.y,
      z: laserOffset.z,
      range: 1000,
      velocity: [laserDirection.x, laserDirection.y, laserDirection.z],
    };

    setLasers([...lasers, laser]);
  };

  return (
    <mesh position={[0, 0, -8]} onClick={handleClick}>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial
        attach="material"
        color="#FFC71F"
        emissive="#FFC71F"
        visible={false}
      />
    </mesh>
  );
};

export const Lasers = () => {
  const lasers = useRecoilValue(laserPositionState);
  return (
    <group>
      {lasers.map((laser) => (
        <mesh position={[laser.x, laser.y, laser.z]} key={laser.id}>
          <sphereGeometry attach="geometry" args={[0.05, 5, 5]} />
          <meshStandardMaterial
            attach="material"
            color="#FFC71F"
            emissive="#FFC71F"
          />
        </mesh>
      ))}
    </group>
  );
};
