import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { RecoilRoot } from "recoil";
import PowerBoost from "./lib/PowerBoost";
import GameController from "./lib/GameController";
import Spaceship from "./Spaceship";
import EnemyShip from "./EnemyShip";
import { Lasers, LaserController } from "./Lasers";
import Target from "./Target";
import PlayerHud from "./PlayerHud";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import EnemyLasers, { EnemyLaserController } from "./EnemyLasers";
import Ground from "./Ground";

const Game = () => {
  const gameContainerRef = React.useRef<any>(null);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [gameEnded, setGameEnded] = React.useState<boolean>(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [showInstructions, setShowInstructions] =
    React.useState<boolean>(false);
  const [mousePosition, setMousePosition] = React.useState(
    new THREE.Vector3(0, 0, 0)
  );

  const updateCanvasPosition = () => {
    const canvas = gameContainerRef.current;
    if (canvas) {
      const { innerWidth: width, innerHeight: height } = window;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
    }
  };

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

  // Update canvas position on resize
  React.useEffect(() => {
    updateCanvasPosition();

    const handleResize = () => {
      updateCanvasPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateCanvasPosition);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateCanvasPosition);
    };
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
              <EnemyShip />
              <EnemyLasers />
              <EnemyLaserController />
              <Target mousePosition={mousePosition} />
              <Spaceship mousePosition={mousePosition} />
              <Lasers />
              <LaserController mousePosition={mousePosition} />
              <GameController
                isPlaying={isPlaying}
                hasEnded={gameEnded}
                setHasEnded={setGameEnded}
              />
              <Ground />
              <directionalLight
                castShadow
                color={"#889293"}
                intensity={2.5}
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
                <PowerBoost />
              </EffectComposer>
            </Canvas>
            <PlayerHud />
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
                Use your <MdIcons.MdOutlineMouse /> to move the spaceship
                <br />
                Left-Click to shoot
                <br />
                Spacebar to boost.
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
