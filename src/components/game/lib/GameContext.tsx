import { atom } from "recoil";

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
  velocity: number[];
}

interface Enemy {
  x: number;
  y: number;
  z: number;
}

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

export const enemyPositionState = atom<Enemy[]>({
  key: "enempyPosition",
  default: [
    { x: -10, y: 10, z: -80 },
    { x: 20, y: 20, z: -100 },
  ],
});

export const laserPositionState = atom<Laser[]>({
  key: "laserPositionState",
  default: [],
});

// Game progression state
export const scoreState = atom({
  key: "score",
  default: 0,
});

export const currentLevelState = atom({
  key: "currentLevel",
  default: 1,
});

export const levelConfigs = [
  { level: 1, enemyCount: 5, enemySpeed: 0.1 },
  { level: 2, enemyCount: 8, enemySpeed: 0.15 },
  { level: 3, enemyCount: 12, enemySpeed: 0.2 },
];

export const generateEnemiesForLevel = (level: number): Enemy[] => {
  const config = levelConfigs.find((c) => c.level === level);
  if (!config) return [];

  let enemies = [];
  for (let i = 0; i < config.enemyCount; i++) {
    enemies.push({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      z: -100 - Math.random() * 50,
    });
  }

  return enemies;
};
