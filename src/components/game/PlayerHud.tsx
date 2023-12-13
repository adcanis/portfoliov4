import React from "react";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { playerHealthState, isBoostingState } from "./lib/GameContext";

type PlayerHudProps = {
  score: number;
  level: number;
};

const PlayerHud = ({ score, level }: PlayerHudProps) => {
  const [healthBarHeight, setHealthBarHeight] = React.useState<string>("");
  const [thrusterBarHeight, setThrusterBarHeight] = React.useState<string>("");
  const [playerHealth] = useRecoilState(playerHealthState);
  const [isBoosting] = useRecoilState(isBoostingState);

  React.useEffect(() => {
    setHealthBarHeight(`${playerHealth}px`);
  }, [playerHealth]);

  React.useEffect(() => {
    if (isBoosting) {
      setThrusterBarHeight("0px");
    } else {
      setTimeout(() => setThrusterBarHeight("100px"), 5000);
    }
  }, [isBoosting]);

  return (
    <motion.div
      className="player-hud"
      initial={{ opacity: 0, z: 100 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: -100 }}
      transition={{ duration: 1, delay: 0.75 }}
    >
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
      <div className="bar-container">
        <div className="bar-item">
          <div className="bar">
            <motion.div
              className="bar-fill health"
              initial={{ height: healthBarHeight }}
              animate={{ height: healthBarHeight }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <h3>Shields</h3>
        </div>
        <div className="bar-item">
          <div className="bar">
            <motion.div
              className="bar-fill"
              initial={{ height: thrusterBarHeight }}
              animate={{ height: thrusterBarHeight }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </div>
          <h3>Thrusters</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerHud;
