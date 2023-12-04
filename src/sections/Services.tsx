import React from "react";
import { motion } from "framer-motion";
import { servicesData } from "@/utils/data/servicesData";
import Scene from "@/components/about/Scene";
import * as Hi2Icons from "react-icons/hi2";

const Services = () => {
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
          (service: { id: number; name: string; description: string }) => (
            <motion.div
              className="list-item"
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
      <Scene />
    </motion.div>
  );
};

export default Services;
