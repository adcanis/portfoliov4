import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRecoilState } from "recoil";
import { createNoise3D } from "simplex-noise";
import {
  generateEnemies,
  calculateDynamicHitDistance,
  enemyShipPositionState,
  enemyLaserState,
  laserPositionState,
  scoreState,
  isBoostingState,
  playerHealthState,
  shipPositionState,
} from "./GameContext";
import { CalculateLaserDistance } from "./CalculateLaserDistance";

type GameControllerProps = {
  isPlaying: boolean;
  hasEnded: boolean;
  setHasEnded: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameController = ({
  isPlaying,
  hasEnded,
  setHasEnded,
}: GameControllerProps) => {
  const noise3D = createNoise3D();
  const [enemyShips, setEnemyShips] = useRecoilState(enemyShipPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [enemyLasers, setEnemyLasers] = useRecoilState(enemyLaserState);
  const [score, setScore] = useRecoilState(scoreState);
  const [isBoosting, setIsBoosting] = useRecoilState(isBoostingState);
  const [playerHealth, setPlayerHealth] = useRecoilState(playerHealthState);
  const [playerShipPosition, setPlayerShipPosition] =
    useRecoilState(shipPositionState);

  React.useEffect(() => {
    if (isPlaying && enemyShips.length === 0) {
      setEnemyShips(generateEnemies());
    }
  }, [isPlaying, enemyShips, setEnemyShips]);

  React.useEffect(() => {
    if (hasEnded) {
      setEnemyShips([]);
      setLaserPositions([]);
      setScore(0);
    }
  }, [hasEnded, setEnemyShips, setLaserPositions, setScore]);

  useFrame(() => {
    if (!isPlaying) return;

    // Ensure enemy ships are within bounds
    const enemyBounds = 25;
    const enemyMinHeight = 10;
    const enemyMaxHeight = 50;
    const enemySpeedMultiplier = isBoosting ? 5 : -1;

    // Update enemy ship positions and directions based on noise
    const updatedEnemyShips = enemyShips.map((enemy, index) => {
      const time = Date.now() * 0.0025 + index;
      const noiseX = noise3D(enemy.x * 0.01, time, index) * 2 - 1;
      const noiseY = noise3D(enemy.y * 0.01, time, index) * 5 + 1;
      const noiseZ = noise3D(enemy.z * 0.01, time, index) * 0.25 - 1;

      const changeDirection = Math.random() < 0.075;
      let newDirection = enemy.direction || new THREE.Vector3();

      if (changeDirection) {
        newDirection = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize();
      }

      const speed = 1;
      const movement = newDirection
        .clone()
        .multiplyScalar(speed)
        .add(new THREE.Vector3(noiseX, noiseY, noiseZ).multiplyScalar(0.1));

      const boundedX = Math.min(
        Math.max(enemy.x + movement.x, -enemyBounds),
        enemyBounds
      );
      const boundedY = Math.min(
        Math.max(enemy.y + movement.y, enemyMinHeight),
        enemyMaxHeight
      );

      return {
        ...enemy,
        x: boundedX,
        y: boundedY,
        z: enemy.z + movement.z * enemySpeedMultiplier,
        direction: newDirection,
      };
    });

    setEnemyShips(updatedEnemyShips);

    // check for collison from enemy laser to player ship
    enemyLasers.forEach((laser) => {
      const distanceToPlayer = CalculateLaserDistance(
        laser,
        playerShipPosition.position
      );
      if (distanceToPlayer < calculateDynamicHitDistance(isBoosting)) {
        // Collision detected, reduce player health
        setPlayerHealth((currentHealth) => Math.max(currentHealth - 10, 0));
      }
    });

    if (playerHealth === 0) {
      setHasEnded(true);
      setPlayerHealth(100);
    }

    const updatedLasers = lasers.map((laser) => ({
      ...laser,
      x: laser.x + laser.velocity[0],
      y: laser.y + laser.velocity[1],
      z: laser.z - laser.velocity[2],
    }));

    const hitEnemyIndices = new Set();
    updatedLasers.forEach((laser) => {
      enemyShips.forEach((enemy, index) => {
        if (
          CalculateLaserDistance(laser, enemy) <
          calculateDynamicHitDistance(isBoosting)
        ) {
          hitEnemyIndices.add(index);
          setScore((prevScore) => prevScore + 1);
        }
      });
    });

    if (hitEnemyIndices.size > 0) {
      setEnemyShips(
        enemyShips.filter((_, index) => !hitEnemyIndices.has(index))
      );
    }

    setLaserPositions(
      updatedLasers.filter((laser) => laser.z > -laser.range && laser.y > -50)
    );

    if (enemyShips.length === 0) {
      setEnemyShips(generateEnemies());
    }
  });

  return null;
};

export default GameController;
