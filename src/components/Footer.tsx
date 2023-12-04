import React from "react";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { socialLinks } from "@/utils/data/socialLinkData";

type SocialProps = {
  id: number;
  name: string;
  url: string;
};

const Footer = () => {
  const localTime = DateTime.local().toLocaleString(DateTime.TIME_SIMPLE);
  return (
    <motion.footer className="footer-container">
      <div className="footer-left">
        <h4>Local Time</h4>
        <p>{localTime}</p>
      </div>
      <div className="footer-right">
        <h4>Socials</h4>
        <div className="socials">
          {socialLinks.map((link: SocialProps) => (
            <a
              key={link.id}
              className="btn-underline"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
