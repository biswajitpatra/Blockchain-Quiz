import "tailwindcss/tailwind.css";
import { AnimatePresence, motion } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        key={router.route}
      >
        <Component {...pageProps} key={router.route} />
      </motion.div>
    </AnimatePresence>
  );
}

export default MyApp;
