import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import About from "@/sections/About";
import Services from "@/sections/Services";
import Game from "@/components/game/Game";
import Recognition from "@/sections/Recognition";
import Contact from "@/sections/Contact";

type HomeProps = {
  setIsShowingContactCard: (value: boolean) => void;
};

export default function Home({ setIsShowingContactCard }: HomeProps) {
  return (
    <motion.main
      className="home page-container"
      initial={{ opacity: 0, z: 100 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: -100 }}
      transition={{ duration: 1, delay: 0.75 }}
    >
      <Hero />
      <About />
      <Services />
      <Game />
      <Recognition />
      <Contact setIsShowingContactCard={setIsShowingContactCard} />
      <Footer />
    </motion.main>
  );
}
