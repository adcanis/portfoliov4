import React from "react";
import { motion } from "framer-motion";
import Scene from "./hero/Scene";
import ScrollDownBtn from "./ScrollDownBtn";

const Hero = () => {
  return (
    <motion.div
      className="hero-container"
      initial={{ opacity: 0, z: 100 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: -100 }}
      transition={{ duration: 1, delay: 0.75 }}
    >
      <Scene />
      <ScrollDownBtn />
    </motion.div>
  );
};

export default Hero;
