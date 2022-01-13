import 'tailwindcss/tailwind.css';
import { AnimatePresence, motion } from 'framer-motion';
import { Web3ReactProvider } from '@web3-react/core';
import Web3 from 'web3';

function getLibrary(provider) {
    return new Web3(provider);
}

function MyApp({ Component, pageProps, router }) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
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
        </Web3ReactProvider>
    );
}

export default MyApp;
