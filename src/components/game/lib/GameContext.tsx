import { atom } from "recoil";
import { v4 as uuidv4 } from "uuid";

interface Ship {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}

interface Laser {
  id: string;
  x: number;
  y: number;
  z: number;
  opacity?: number;
  range: number;
  velocity: number[];
}

interface EnemyShip {
  id: string;
  x: number;
  y: number;
  z: number;
  health: number;
}

interface EnemyLaser {
  id: string;
  x: number;
  y: number;
  z: number;
  opacity?: number;
  range: number;
  velocity: number[];
}

interface PowerUp {
  x: number;
  y: number;
  z: number;
  type: string;
}

interface LevelConfig {
  level: number;
  meteorCount: number;
  meteorSpeed: number;
}

export const playerHealthState = atom({
  key: "playerHealth",
  default: 100,
});

export const shipPositionState = atom<Ship>({
  key: "shipPosition",
  default: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
});

export const laserPositionState = atom<Laser[]>({
  key: "laserPositionState",
  default: [],
});

export const isBoostingState = atom({
  key: "isBoosting",
  default: false,
});

export const powerUpState = atom<PowerUp[]>({
  key: "powerUpState",
  default: [],
});

export const enemyShipPositionState = atom<EnemyShip[]>({
  key: "enemyShipPositionState",
  default: [],
});

export const enemyLaserState = atom<EnemyLaser[]>({
  key: "enemyLaserState",
  default: [],
});

export const scoreState = atom({
  key: "score",
  default: 0,
});

export const currentLevelState = atom({
  key: "currentLevel",
  default: 1,
});

export const levelConfigs: LevelConfig[] = [
  { level: 1, meteorCount: 1, meteorSpeed: 0.1 },
  { level: 2, meteorCount: 3, meteorSpeed: 0.15 },
  {
    level: 3,
    meteorCount: 5,
    meteorSpeed: 1,
  },
];

export const calculateDynamicHitDistance = (isBoosting: boolean) => {
  const baseHitDistance = 25;
  const boostMultiplier = isBoosting ? 1.5 : 1;

  return baseHitDistance * boostMultiplier;
};

let isFirstGeneration = true;

export const generateEnemies = (): EnemyShip[] => {
  let numberOfEnemies;

  if (isFirstGeneration) {
    // Generate a 1 enemy for the first generation
    numberOfEnemies = Math.floor(Math.random() * 1) + 1;
    isFirstGeneration = false;
  } else {
    numberOfEnemies = 3;
  }

  let newEnemies: EnemyShip[] = [];
  for (let i = 0; i < numberOfEnemies; i++) {
    newEnemies.push({
      id: uuidv4(),
      x: Math.random() * 50 - 10,
      y: Math.random() * 50 - 10,
      z: -100 - Math.random() * 50,
      health: 100,
    });
  }

  return newEnemies;
};
