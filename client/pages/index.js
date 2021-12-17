import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import WalletModal from "../components/WalletModal";

const ease = [0.43, 0.13, 0.23, 0.96];

const pageVariants = {
  initial: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.5 },
  },
  animate: {
    y: "0%",
    opacity: 1,
    transition: { ease, duration: 0.5 },
  },
  exit: {
    y: "50%",
    opacity: 0,
    transition: { ease, duration: 0.8, delay: 0.5 },
  },
};

export default function Home() {
  return (
    <>
      <WalletModal required={false} />
      <motion.div
        variants={pageVariants}
        className="flex flex-col items-center justify-center min-h-screen py-2"
      >
        <Head>
          <title> Quiz App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            <div className="text-blue-600">Quiz App</div>
          </h1>

          <p className="mt-3 text-2xl">
            based on <span className="font-bold">Blockchain</span>
          </p>
          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <Link href="/organizer">
              <a
                type="button"
                className="transition hover:shadow shadow-xl duration-500 ease-in-out p-6 mt-6 text-center border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 h-36"
              >
                <h3 className="text-2xl font-bold">&#11164; Organizer</h3>
                <p className="mt-4 text-xl">
                  Create quizzes and advertize your company.
                </p>
              </a>
            </Link>

            <Link href="/organizer">
              <a
                type="button"
                className="transition duration-500 hover:shadow shadow-xl ease-in-out p-6 mt-6 text-center border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 h-36"
              >
                <h3 className="text-2xl font-bold">Player &#10148;</h3>
                <p className="mt-4 text-xl">Play and earn rewards.</p>
              </a>
            </Link>
          </div>
        </main>

        <footer className="flex items-center justify-center w-full h-5 border-t">
          <a
            className="flex items-center justify-center"
            href="https://github.com/biswajitpatra/Blockchain-Quiz.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            Made with ♥
          </a>
        </footer>
      </motion.div>
    </>
  );
}
