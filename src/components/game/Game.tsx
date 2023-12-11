import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useRecoilState, RecoilRoot } from "recoil";
import {
  meteorPositionState,
  generateMeteorsForLevel,
  laserPositionState,
  currentLevelState,
  scoreState,
  levelConfigs,
} from "./lib/GameContext";
import Spaceship from "./Spaceship";
import Meteor from "./Meteor";
import { Lasers, LaserController } from "./Lasers";
import Target from "./Target";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";

type GameControllerProps = {
  isPlaying: boolean;
  setDisplayedScore: React.Dispatch<React.SetStateAction<number>>;
  setDisplayedLevel: React.Dispatch<React.SetStateAction<number>>;
  hasEnded: boolean;
  setHasEnded: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameController = ({
  isPlaying,
  setDisplayedScore,
  setDisplayedLevel,
  hasEnded,
  setHasEnded,
}: GameControllerProps) => {
  const [currentLevel, setCurrentLevel] = useRecoilState(currentLevelState);
  const [meteors, setMeteors] = useRecoilState(meteorPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [score, setScore] = useRecoilState(scoreState);

  // Load level configs and set current level
  const currentLevelConfig = levelConfigs.find(
    (config) => config.level === currentLevel
  );

  const calculateLaserDistance = (laser: any, meteor: any) => {
    const dx = meteor.x - laser.x;
    const dy = meteor.y - laser.y;
    const dz = meteor.z - laser.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // Generate meteors when game starts
  React.useEffect(() => {
    if (isPlaying && meteors.length === 0) {
      setMeteors(generateMeteorsForLevel(currentLevel));
      setCurrentLevel((prevLevel) => prevLevel + 1);
    }
  }, [isPlaying, meteors, setMeteors, currentLevel, setCurrentLevel]);

  // Reset game when game ends
  React.useEffect(() => {
    if (hasEnded) {
      setMeteors([]);
      setLaserPositions([]);
      setScore(0);
      setCurrentLevel(1);
    }
  }, [hasEnded, setMeteors, setLaserPositions, setScore, setCurrentLevel]);

  // update displayed score
  React.useEffect(() => {
    if (score) {
      setDisplayedScore(score);
    }
  }, [score, setDisplayedScore]);

  useFrame(() => {
    if (!isPlaying) return;

    const hitMeteorIndex = new Set();
    const meteorSpeed = currentLevelConfig
      ? currentLevelConfig.meteorSpeed
      : 0.1;

    // Check if laser hits meteor
    lasers.forEach((laser, laserIndex) => {
      meteors.forEach((meteor, meteorIndex) => {
        if (calculateLaserDistance(laser, meteor) < 3) {
          console.log(
            `Laser hit meteor: Laser ID ${laser.id}, Meteor Index ${meteorIndex}`
          );
          hitMeteorIndex.add(meteorIndex);
          setLaserPositions((prevLasers) =>
            prevLasers.filter((_, idx) => idx !== laserIndex)
          );
        }
      });
    });

    // Remove hit meteors and update score
    if (hitMeteorIndex.size > 0) {
      setScore((prevScore) => prevScore + hitMeteorIndex.size);
      setMeteors((prevMeteor) =>
        prevMeteor.filter((_, idx) => !hitMeteorIndex.has(idx))
      );
    }

    // Move meteors
    setMeteors((prevMeteor) =>
      prevMeteor.map((meteor) => ({
        ...meteor,
        z: meteor.z + meteorSpeed,
      }))
    );

    // Move lasers
    setLaserPositions(
      (prevLasers) =>
        prevLasers
          .map((laser) => ({
            ...laser,
            id: laser.id,
            x: laser.x + laser.velocity[0],
            y: laser.y + laser.velocity[1],
            z: laser.z + laser.velocity[1],
            velocity: laser.velocity,
          }))
          .filter((laser) => laser.z > -laser.range && laser.y > -50) // ground height
    );

    if (meteors.length === 0) {
      const nextLevel = currentLevel + 1;
      if (nextLevel <= 3) {
        setCurrentLevel(nextLevel);
        setDisplayedLevel(nextLevel);
        setMeteors(generateMeteorsForLevel(nextLevel));
      } else {
        setHasEnded(true);
      }
    }
  });

  return null;
};

const Game = () => {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [gameEnded, setGameEnded] = React.useState<boolean>(false);
  const [displayedScore, setDisplayedScore] = React.useState<number>(0);
  const [displayedLevel, setDisplayedLevel] = React.useState<number>(1);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [showInstructions, setShowInstructions] =
    React.useState<boolean>(false);
  const [mousePosition, setMousePosition] = React.useState(
    new THREE.Vector3(0, 0, 0)
  );

  // Detect mobile
  React.useEffect(() => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setIsMobile(mobile);
  }, []);

  // ESC key to end game
  React.useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape") {
        setIsPlaying(false);
        setGameEnded(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Disable and enable scrolling based on isPlaying
  React.useEffect(() => {
    const preventScroll = (e: any) => e.preventDefault();

    if (isPlaying) {
      window.addEventListener("wheel", preventScroll, { passive: false });
      document.body.style.overflow = "hidden";
    } else {
      window.removeEventListener("wheel", preventScroll);
      document.body.style.overflow = "";
    }

    return () => window.removeEventListener("wheel", preventScroll);
  }, [isPlaying]);

  const handleMobileNotification = () => {
    toast.info("Uh oh! This game is not available on mobile.");
  };

  const handlePointerMove = (e: any) => {
    const bounds = e.target.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
    setMousePosition(new THREE.Vector3(x, y, 0));
  };

  return (
    <div className="game-container">
      {isPlaying ? (
        <React.Suspense fallback={null}>
          <RecoilRoot>
            <Canvas
              key={isPlaying ? "playing" : "not-playing"}
              shadows
              onPointerMove={handlePointerMove}
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: "0",
                left: "0",
              }}
            >
              <PerspectiveCamera makeDefault fov={50} position={[3, 2, 5]} />
              <Target mousePosition={mousePosition} />
              <Spaceship mousePosition={mousePosition} />
              <Meteor />
              <Lasers />
              <LaserController mousePosition={mousePosition} />
              <GameController
                isPlaying={isPlaying}
                hasEnded={gameEnded}
                setHasEnded={setGameEnded}
                setDisplayedScore={setDisplayedScore}
                setDisplayedLevel={setDisplayedLevel}
              />
              <directionalLight
                castShadow
                color={"#889293"}
                intensity={5}
                position={[10, 5, 4]}
                shadow-bias={-0.0005}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.01}
                shadow-camera-far={20}
                shadow-camera-top={6}
                shadow-camera-bottom={-6}
                shadow-camera-left={-6.2}
                shadow-camera-right={6.4}
              />
            </Canvas>
          </RecoilRoot>
          <motion.div className="game-hud">
            <div className="score">
              <span>Score</span>
              <span>{displayedScore}</span>
            </div>
            <div className="level">
              <span>Level</span>
              <span>{displayedLevel}</span>
            </div>
          </motion.div>
        </React.Suspense>
      ) : (
        <div className="game-start">
          {!showInstructions ? (
            <>
              <motion.h1
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{
                  duration: 0.75,
                  delay: 0.25,
                  y: { type: "spring", stiffness: 100, damping: 10 },
                }}
              >
                <GiIcons.GiSpaceship />
              </motion.h1>
              <motion.button
                className="btn-transparent"
                initial={{ opacity: 0, z: 100 }}
                whileInView={{ opacity: 1, z: 0 }}
                exit={{ opacity: 0, z: -100 }}
                transition={{ duration: 1, delay: 0.5 }}
                onClick={() =>
                  isMobile
                    ? handleMobileNotification()
                    : setShowInstructions(true)
                }
              >
                Play
              </motion.button>
            </>
          ) : (
            <>
              <motion.p
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{
                  duration: 0.75,
                  delay: 0.25,
                  y: { type: "spring", stiffness: 100, damping: 10 },
                }}
              >
                Use your <MdIcons.MdOutlineMouse /> to move the spaceship and{" "}
                left-click to shoot.
                <br />
                <br />
                Press <span>ESC</span> to end the game.
              </motion.p>
              <motion.button
                className="btn-transparent"
                initial={{ opacity: 0, z: 100 }}
                whileInView={{ opacity: 1, z: 0 }}
                exit={{ opacity: 0, z: -100 }}
                transition={{ duration: 1, delay: 0.5 }}
                onClick={() => {
                  setIsPlaying(true);
                  setShowInstructions(false);
                }}
              >
                Got it!
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
