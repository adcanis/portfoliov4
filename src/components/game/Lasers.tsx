import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { laserPositionState, shipPositionState } from "./lib/GameContext";
import { v4 as uuidv4 } from "uuid";

export const LaserController = () => {
  const shipPosition = useRecoilValue(shipPositionState);
  const [lasers, setLasers] = useRecoilState(laserPositionState);

  React.useEffect(() => {
    const fireLaser = () => {
      const newLaser = {
        id: uuidv4(),
        x: 0,
        y: 0,
        z: 0,
        velocity: [shipPosition.rotation.x * 6, shipPosition.rotation.y * 5],
      };

      setLasers([...lasers, newLaser]);
    };

    const handleKeyDown = (e: any) => {
      if (e.code === "Space") {
        fireLaser();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lasers, setLasers, shipPosition]);

  return null;
};

export const Lasers = () => {
  const lasers = useRecoilValue(laserPositionState);
  return (
    <group>
      {lasers.map((laser) => (
        <mesh position={[laser.x, laser.y, laser.z]} key={`${laser.id}`}>
          <cylinderGeometry attach="geometry" args={[0.05, 0.05, 5, 32]} />
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
