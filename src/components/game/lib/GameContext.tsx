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
  range: number;
  velocity: number[];
}

interface Meteor {
  x: number;
  y: number;
  z: number;
  type: string;
  health: number;
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
  boss?: {
    type: string;
    health: number;
  };
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

export const meteorPositionState = atom<Meteor[]>({
  key: "meteorPosition",
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
  { level: 1, meteorCount: 5, meteorSpeed: 0.1 },
  { level: 2, meteorCount: 8, meteorSpeed: 0.15 },
  {
    level: 3,
    meteorCount: 12,
    meteorSpeed: 0.2,
    boss: { type: "planetNova", health: 50 },
  },
];

export const generateMeteorsForLevel = (level: number): Meteor[] => {
  const config = levelConfigs.find((c) => c.level === level);
  if (!config) return [];

  let meteors = [];
  for (let i = 0; i < config.meteorCount; i++) {
    meteors.push({
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      z: -100 - Math.random() * 50,
      type: "enemy",
      health: 1,
    });
  }

  return meteors;
};
