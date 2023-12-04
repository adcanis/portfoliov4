import React from "react";
import { motion } from "framer-motion";
import * as Hi2Icons from "react-icons/hi2";

const About = () => {
  return (
    <div className="about-container" id="about">
      <motion.div
        className="title"
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          y: { type: "spring", stiffness: 100, damping: 10 },
        }}
      >
        <h3>Who I am</h3>
        <span>
          <Hi2Icons.HiMiniArrowDownRight />
        </span>
      </motion.div>
      <motion.div
        className="body"
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{
          duration: 0.5,
          delay: 0.35,
          y: { type: "spring", stiffness: 100, damping: 10 },
        }}
      >
        <p>
          I{"'"}m a software professional passionate about fusing innovative
          design with cutting-edge technology in web and mobile application
          development<span>.</span>
        </p>
      </motion.div>
    </div>
  );
};

export default About;
