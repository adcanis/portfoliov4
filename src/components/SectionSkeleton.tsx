import React from "react";
import { motion } from "framer-motion";
import * as Hi2Icons from "react-icons/hi2";

type SectionSkeletonProps = {
  title: string;
  animation?: React.ReactNode;
  animationPosition?: "left" | "right";
  children: React.ReactNode;
};

const SectionSkeleton = ({
  title,
  children,
  animation,
  animationPosition,
}: SectionSkeletonProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const cursorPositionRef = React.useRef({ x: 0, y: 0 });
  const animationFrameIdRef = React.useRef<number | null>(null);
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });

  const updateCursorPosition = React.useCallback(() => {
    setCursorPosition({ ...cursorPositionRef.current });
  }, []);

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const deltaY = e.clientY - rect.top;

        cursorPositionRef.current.y = Math.max(Math.min(deltaY, 100), -100);

        if (animationFrameIdRef.current !== null) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
        animationFrameIdRef.current =
          requestAnimationFrame(updateCursorPosition);
      }
    },
    [updateCursorPosition]
  );

  React.useEffect(() => {
    const currentRef = ref.current;
    currentRef?.addEventListener("mousemove", handleMouseMove);

    return () => {
      currentRef?.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      className="section-container"
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{
        duration: 0.5,
        delay: 0.75,
        y: { type: "spring", stiffness: 100, damping: 10 },
      }}
    >
      <div className="title">
        <h3>{title}</h3>
        <span>
          <Hi2Icons.HiMiniArrowDownRight />
        </span>
      </div>
      <motion.div
        className="animation-canvas-container"
        initial={{ opacity: 0, z: 100, y: -5 }}
        whileInView={{
          opacity: 1,
          y: cursorPosition.y,
          z: 0,
        }}
        style={{
          right:
            animationPosition && animationPosition === "right"
              ? "-210px"
              : "auto",
          left:
            animationPosition && animationPosition === "left"
              ? "-210px"
              : "auto",
        }}
        exit={{ opacity: 0, z: -100, y: 5 }}
      >
        {animation ? animation : null}
      </motion.div>
      <motion.div className="body" ref={ref}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default SectionSkeleton;
