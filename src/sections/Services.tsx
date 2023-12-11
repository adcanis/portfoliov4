import React from "react";
import { motion } from "framer-motion";
import { servicesData } from "@/utils/data/servicesData";
import Scene from "@/components/about/Scene";
import * as Hi2Icons from "react-icons/hi2";

const Services = () => {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  // Detect mobile
  React.useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(mobile);
  }, []);

  const handleTap = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex < servicesData.length - 1) {
        return prevIndex + 1;
      } else {
        window.scrollBy({
          top: window.innerHeight + 500,
          left: 0,
          behavior: "smooth",
        });
        return 0;
      }
    });
  };

  return (
    <motion.div className="services-container">
      <motion.div
        className="title"
        initial={{ opacity: 0, z: 100, y: -5 }}
        whileInView={{ opacity: 1, z: 0, y: 0 }}
        exit={{ opacity: 0, z: -100, y: 5 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3>What I do</h3>
        <span>
          <Hi2Icons.HiMiniArrowDownRight />
        </span>
      </motion.div>
      <div className="list">
        {servicesData.map(
          (
            service: { id: number; name: string; description: string },
            index: number
          ) => (
            <motion.div
              className={`list-item ${
                index === activeIndex ? "active-style" : ""
              }`}
              key={service.id}
              initial={{ opacity: 0, z: 100 }}
              animate={{ opacity: 1, z: 0 }}
              exit={{ opacity: 0, z: -100 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="text-container">
                <h1>{service.name}</h1>
                <div className="text-description">
                  <p>{service.description}</p>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
      {!isMobile ? <Scene /> : null}
      <motion.div
        className="tap-container"
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          y: { type: "spring", stiffness: 100, damping: 10 },
        }}
        onClick={handleTap}
      >
        <span>
          <Hi2Icons.HiOutlineFingerPrint />
        </span>
        <p>Tap to explore</p>
      </motion.div>
    </motion.div>
  );
};

export default Services;
