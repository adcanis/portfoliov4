import React from "react";
import { motion, useScroll } from "framer-motion";
import background from "@/assets/scroll-bg.png";
import * as BsIcons from "react-icons/bs";

const ScrollDownBtn = () => {
  const { scrollYProgress } = useScroll();
  const [showButton, setShowButton] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
    }, 3000);
  }, []);

  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight + 750,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <motion.div
          className="scroll-down-container"
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{
            duration: 0.5,
            delay: 0.35,
            y: { type: "spring", stiffness: 100, damping: 10 },
          }}
          style={{
            transform: `translateY(${scrollYProgress})`,
          }}
          onClick={() => handleScroll()}
        >
          <motion.img
            src={background.src}
            alt="background"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            exit={{ rotate: 0 }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
          <motion.div
            className="floating-arrow"
            initial={{ opacity: 0.25, y: -100 }}
            animate={{ opacity: 0.75, y: 100 }}
            exit={{ opacity: 0.25, y: 100 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ transform: `translateY(${scrollYProgress})` }}
          >
            <BsIcons.BsChevronCompactDown />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ScrollDownBtn;
