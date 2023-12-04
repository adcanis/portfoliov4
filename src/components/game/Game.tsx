import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, CubeCamera, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRecoilState, RecoilRoot } from "recoil";
import {
  enemyPositionState,
  generateEnemiesForLevel,
  laserPositionState,
  currentLevelState,
  scoreState,
} from "./lib/GameContext";
import Spaceship from "./Spaceship";
import Enemy from "./Enemy";
import { Lasers, LaserController } from "./Lasers";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";

type GameProgressionProps = {
  isPlaying: boolean;
  hasEnded: boolean;
  setHasEnded: React.Dispatch<React.SetStateAction<boolean>>;
};

const LASER_RANGE = 100;
const LASER_Z_VELOCITY = 1;
const ENEMY_SPEED = 0.1;
const GROUND_HEIGHT = -50;

const GameProgression = ({
  isPlaying,
  hasEnded,
  setHasEnded,
}: GameProgressionProps) => {
  const [currentLevel, setCurrentLevel] = useRecoilState(currentLevelState);
  const [enemies, setEnemies] = useRecoilState(enemyPositionState);
  const [lasers, setLaserPositions] = useRecoilState(laserPositionState);
  const [score, setScore] = useRecoilState(scoreState);

  const laserDistance = (p1: any, p2: any) => {
    const a = p2.x - p1.x;
    const b = p2.y - p1.y;
    const c = p2.z - p1.z;

    return Math.sqrt(a * a + b * b + c * c);
  };

  useFrame(() => {
    let hitEnemyIndexes = new Set();

    lasers.forEach((laser, laserIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        if (laserDistance(laser, enemy) < 3) {
          hitEnemyIndexes.add(enemyIndex);
          setLaserPositions(lasers.filter((_, idx) => idx !== laserIndex));
        }
      });
    });

    if (hitEnemyIndexes.size > 0) {
      setScore((score) => score + hitEnemyIndexes.size);
      console.log("hit detected");
      setEnemies(enemies.filter((_, idx) => !hitEnemyIndexes.has(idx)));
    }

    setEnemies(
      enemies.map((enemy) => ({
        ...enemy,
        z: enemy.z + ENEMY_SPEED,
      }))
    );

    setLaserPositions(
      lasers
        .map((laser) => ({
          ...laser,
          x: laser.x + laser.velocity[0],
          y: laser.y + laser.velocity[1],
          z: laser.z + LASER_Z_VELOCITY,
        }))
        .filter((laser) => laser.z > -LASER_RANGE && laser.y > GROUND_HEIGHT)
    );

    if (enemies.length === 0) {
      const nextLevel = currentLevel + 1;
      if (nextLevel <= 3) {
        setCurrentLevel(nextLevel);
        setEnemies(generateEnemiesForLevel(nextLevel));
      } else {
        setHasEnded(true);
      }
    }
  });

  React.useEffect(() => {
    if (!isPlaying) return;
    if (enemies.length === 0) {
      setEnemies(generateEnemiesForLevel(currentLevel));
      setCurrentLevel(currentLevel + 1);
    }
  }, [isPlaying, enemies, setEnemies, currentLevel, setCurrentLevel]);

  return null;
};

const Game = () => {
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [gameEnded, setGameEnded] = React.useState<boolean>(false);
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
              <CubeCamera resolution={256} frames={Infinity}>
                {(texture) => (
                  <>
                    <Environment map={texture} />
                    <Spaceship mousePosition={mousePosition} />
                    <Enemy />
                    <Lasers />
                    <LaserController />
                  </>
                )}
              </CubeCamera>
              <directionalLight
                castShadow
                color={"#889293"}
                intensity={2}
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
              <EffectComposer>
                <Bloom
                  blendFunction={BlendFunction.ADD}
                  intensity={1.5}
                  width={300}
                  height={300}
                  kernelSize={5}
                  luminanceThreshold={0.15}
                  luminanceSmoothing={0.025}
                />
              </EffectComposer>
              <GameProgression
                isPlaying={isPlaying}
                hasEnded={gameEnded}
                setHasEnded={setGameEnded}
              />
            </Canvas>
          </RecoilRoot>
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
                <MdIcons.MdSpaceBar /> to shoot.
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
