import Head from "next/head";
import Footer from "./footer";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function About() {
  return (
    <>
      <Head>
        <title>About | HealConnect</title>
      </Head>

      <main className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
        <div className="container mx-auto px-6 py-16">
          <motion.header
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <Typewriter
                words={["About HealConnect"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Learn more about our mission and how we’re shaping the future of healthcare.
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
          </motion.header>

          <div className="prose dark:prose-invert prose-lg max-w-4xl mx-auto space-y-16">
            {[
              {
                title: "Our Mission",
                content: `HealConnect is Pune’s growing health monitoring site to help hospitals manage their patients' health parameters anytime, anywhere. Our goal is to make patients’ health data accessible to doctors worldwide for quicker diagnosis and treatment.`
              },
              {
                title: "What's in it for you",
                content: `The HealConnect system's kit allows doctors or nurses to measure the patient’s body temperature and heart rate. This real-time data is automatically updated on the WeCare platform, which doctors and hospitals can access remotely.`
              },
              {
                title: "What We Do",
                content: `We empower organizations to monitor their patients’ health by collecting data from our WeCare Kit. This enables smarter decision-making and more timely medical interventions.`
              },
              {
                title: "Terms & Conditions",
                content: `By accessing this website, you agree to our terms and conditions, applicable laws, and local regulations. If you do not agree, you are prohibited from using the site. All content is protected by copyright and trademark law.`
              },
              {
                title: "Content Copyright Policy",
                content: `The site design, logo, and video content are subject to copyright © 2025–present | HealConnect LLC`
              }
            ].map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 255, 100, 0.2)" }}
                className="transition-transform duration-300 ease-in-out cursor-default"
              >
                <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center md:text-left">
                  {section.title}
                </h2>
                <p className="text-lg leading-relaxed">{section.content}</p>
              </motion.section>
            ))}
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
