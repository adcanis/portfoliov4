import React from "react";
import { motion } from "framer-motion";
import { AwardsData } from "@/utils/data/awardsData";
import SectionSkeleton from "../components/SectionSkeleton";

const Recognition = () => {
  const [awards, setAwards] = React.useState<any[]>([]);

  React.useEffect(() => {
    const getAwards = () => {
      if (AwardsData) {
        const filteredAwards = AwardsData.filter(
          (award: any) => award.awards > 0
        );
        setAwards(filteredAwards);
      }
    };
    getAwards();
  }, []);

  return (
    <SectionSkeleton title="Recognition / Publications">
      <motion.div
        className="recognition-container"
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.9 }}
        transition={{
          duration: 0.5,
          delay: 0.75,
          y: { type: "spring", stiffness: 100, damping: 10 },
        }}
      >
        <div className="recognition-body">
          {awards.map((award: any) => (
            <div className="recognition" key={award.id}>
              <h1>{award.company}</h1>
              <span>{`[x${award.awards}]`}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </SectionSkeleton>
  );
};

export default Recognition;
