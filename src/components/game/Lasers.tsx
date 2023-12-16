import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { v4 as uuidv4 } from "uuid";
import { Howl } from "howler";
import { useRecoilState, useRecoilValue } from "recoil";
import { laserPositionState, shipPositionState } from "./lib/GameContext";

export const LaserController = ({
  mousePosition,
}: {
  mousePosition: THREE.Vector3;
}) => {
  const shipPosition = useRecoilValue(shipPositionState);
  const [lasers, setLasers] = useRecoilState(laserPositionState);

  const laserSound = new Howl({
    src: "/audio/laser.mp3",
    volume: 0.25,
  });

  const handleClick = () => {
    const calculatedTargetPosition = new THREE.Vector3(
      mousePosition.x * 6,
      mousePosition.y * 2 + 3.33,
      5
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

    const speed = 0.33;
    const offsetMultiplier = 0.25;
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
      z: laserOffset.z - 7.5,
      range: 500,
      velocity: [laserDirection.x, laserDirection.y, laserDirection.z],
    };

    laserSound.play();
    setLasers([...lasers, laser]);
  };

  return (
    <mesh position={[0, 0, 0]} onClick={handleClick}>
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
  const [lasers, setLasers] = useRecoilState(laserPositionState);

  useFrame(() => {
    setLasers((currentLasers) =>
      currentLasers.map((laser) => ({
        ...laser,
        opacity: laser.opacity ? laser.opacity + 0.01 : 0,
      }))
    );
  });

  return (
    <group>
      {lasers.map((laser) => (
        <mesh position={[laser.x, laser.y, laser.z]} key={laser.id}>
          <sphereGeometry attach="geometry" args={[0.025, 5, 5]} />
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
