import React from "react";
import { motion } from "framer-motion";
import * as Hi2Icons from "react-icons/hi2";

type ContactProps = {
  setIsShowingContactCard: (value: boolean) => void;
};

const Contact = ({ setIsShowingContactCard }: ContactProps) => {
  return (
    <motion.div
      className="contact-section-container"
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: 0.15,
        y: { type: "spring", stiffness: 100, damping: 10 },
      }}
    >
      <div className="header">
        <h1>Let{"'"}s work Together</h1>
        <span>
          <Hi2Icons.HiMiniArrowDownLeft />
        </span>
      </div>
      <div className="contact-btn-container">
        <span className="line" />
        <button onClick={() => setIsShowingContactCard(true)}>
          Get Started
        </button>
      </div>
    </motion.div>
  );
};

export default Contact;
