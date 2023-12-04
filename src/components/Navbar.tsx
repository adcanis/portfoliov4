import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Navbar = () => {
  const audioRef = React.useRef<any>();
  const [isPlayingSound, setIsPlayingSound] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = 0.25;

    const handlePlayPause = () => {
      if (isPlayingSound) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    };

    audioRef.current.addEventListener("loadeddata", handlePlayPause);

    handlePlayPause();

    return () => {
      if (audioRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioRef.current.removeEventListener("loadeddata", handlePlayPause);
      }
    };
  }, [isPlayingSound]);

  return (
    <>
      <motion.div
        className="navbar-container"
        initial={{
          opacity: 0,
          z: 100,
          clipPath: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
        }}
        animate={{
          opacity: 1,
          z: 0,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        exit={{ opacity: 0, z: -100 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="nav-left">
          <Link href="/" className="logo">
            {"[D]"}
          </Link>
        </div>
      </motion.div>
      <motion.div
        className="sound-container"
        initial={{ opacity: 0, z: 100 }}
        animate={{ opacity: 1, z: 0 }}
        exit={{ opacity: 0, z: -100 }}
        transition={{ duration: 1, delay: 0.75 }}
      >
        <button
          className="btn-basic"
          onClick={() => setIsPlayingSound(!isPlayingSound)}
        >
          Sound
          <motion.span whileTap={{ scale: 0.9 }}>
            {isPlayingSound ? "ON" : "OFF"}
          </motion.span>
        </button>
      </motion.div>
      <audio
        ref={audioRef}
        src="/audio/audio.wav"
        loop
        style={{ display: "none" }}
      />
    </>
  );
};

export default Navbar;
