import React from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  CubeCamera,
  Environment,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import SpaceMan from "./about/SpaceMan";

type LoadingProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const percents = ["", "10", "25", "33", "50", "66", "90", "100"];

const Loader = ({ isLoading, setIsLoading }: LoadingProps) => {
  const [percent, setPercent] = React.useState<string>("");
  const [showButton, setShowButton] = React.useState<boolean>(false);

  React.useEffect(() => {
    percents.forEach((percent: string, index: number) => {
      setTimeout(() => setPercent(percent), index * 275);
    });
    setTimeout(() => setShowButton(true), 350 * percents.length);
  }, [setIsLoading]);

  return (
    <React.Suspense fallback={null}>
      <motion.div className="loader">
        <motion.div
          className="loader-animitation"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {!showButton ? (
            <h1>{percent}</h1>
          ) : (
            <motion.div
              className="loader-finished"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h1>
                hello<span>.</span>
              </h1>
              <motion.button
                className="btn-transparent"
                type="button"
                initial={{ opacity: 0, z: 100 }}
                animate={{ opacity: 1, z: 0 }}
                exit={{ opacity: 0, z: -100 }}
                transition={{ duration: 1, delay: 0.5 }}
                onClick={() => setIsLoading(false)}
              >
                Enter
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </React.Suspense>
  );
};

export default Loader;
