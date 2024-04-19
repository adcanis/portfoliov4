import React from "react";
import type { AppProps } from "next/app";
import { Amplify } from "aws-amplify";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollerMotion } from "scroller-motion";
import { ToastContainer } from "react-toastify";
import ReactGA from "react-ga";

// Components
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import PageHead from "@/components/PageHead";
import ContactCard from "@/components/ContactCard";

// Config
import awsconfig from "@/aws-exports";
import AppSyncDataProvider from "@/config/AppSyncDataConfig";

// Utils
import { detectDevToolsShortcut } from "@/utils/detectDevTools";

// Styles
import "@/styles/index.scss";
import "react-toastify/dist/ReactToastify.css";

// Initialize Google Analytics
ReactGA.initialize(`${process.env.NEXT_PUBLIC_REACT_GA_ID}`);

// Initialize Amplify
Amplify.configure({ ...awsconfig, ssr: true });

export default function App({ Component, pageProps }: AppProps) {
  const app = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [isShowingContactCard, setIsShowingContactCard] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    window.addEventListener("keydown", detectDevToolsShortcut);
    return () => window.removeEventListener("keydown", detectDevToolsShortcut);
  }, []);

  return (
    <AppSyncDataProvider>
      <PageHead />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
      />
      {!isLoading ? (
        <AnimatePresence mode="wait">
          <motion.div className="App" ref={app} exit={{ opacity: 0 }}>
            <Navbar />
            <ContactCard
              isShowingContactCard={isShowingContactCard}
              handleIsOpen={() => setIsShowingContactCard(false)}
            />
            <ScrollerMotion scale={1.5}>
              <Component
                {...pageProps}
                setIsShowingContactCard={setIsShowingContactCard}
              />
            </ScrollerMotion>
          </motion.div>
        </AnimatePresence>
      ) : (
        <AnimatePresence mode="wait">
          <Loader isLoading={isLoading} setIsLoading={setIsLoading} />
        </AnimatePresence>
      )}
    </AppSyncDataProvider>
  );
}
