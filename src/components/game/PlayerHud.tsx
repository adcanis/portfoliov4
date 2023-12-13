import React from "react";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { playerHealthState, isBoostingState } from "./lib/GameContext";

type PlayerHudProps = {
  score: number;
  level: number;
};

const PlayerHud = ({ score, level }: PlayerHudProps) => {
  const [playerHealth] = useRecoilState(playerHealthState);
  const [isBoosting] = useRecoilState(isBoostingState);

  const healthBarHeight = `${playerHealth}%`;
  const thrusterBarHeight = `${isBoosting ? 100 : 0}%`;

  return (
    <motion.div
      className="player-hud"
      initial={{ opacity: 0, z: 100 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: -100 }}
      transition={{ duration: 1, delay: 0.75 }}
    >
      <div className="bar-container">
        <div className="bar">
          <h3>Shields</h3>
          <motion.div
            className="bar-fill health"
            initial={{ height: "100%" }}
            animate={{ height: healthBarHeight }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="bar">
          <h3>Thrusters</h3>
          <motion.div
            className="bar-fill"
            initial={{ height: "100%" }}
            animate={{ height: thrusterBarHeight }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
      <div className="game-prog-container">
        <div className="level-indicator">
          <h3>
            Level: <span>{level}</span>
          </h3>
        </div>
        <div className="score-indicator">
          <h3>
            Score: <span>{score}</span>
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerHud;
