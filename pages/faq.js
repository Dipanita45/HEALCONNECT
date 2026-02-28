import React, { useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How does HealConnect monitor my health remotely?",
    answer:
      "Our health monitoring kit measures vital parameters and sends the data securely to doctors who can access it anytime via the HealConnect platform.",
  },
  {
    question: "What health parameters does the HealConnect kit measure?",
    answer:
      "It measures body temperature, heart rate, and pulse rate — all in a single device for convenience and accuracy.",
  },
  {
    question: "Is my personal and health data secure on HealConnect?",
    answer:
      "Yes, we maintain end-to-end security protocols to ensure your data is accessible only to authorized doctors and yourself.",
  },
  {
    question: "Can doctors and patients both access the monitoring data?",
    answer:
      "Yes, both parties can view health data in real-time through our website for effective monitoring and timely treatment.",
  },
  {
    question: "How quickly can treatment be initiated?",
    answer:
      "Real-time monitoring helps doctors act immediately, improving treatment response and outcomes.",
  },
  {
    question: "Who can use the HealConnect system?",
    answer:
      "HealConnect is designed for healthcare organizations, doctors, and patients looking for a reliable remote monitoring solution.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQ | HealConnect</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
              ❓ FAQ
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Everything you need to know about HealConnect’s remote health monitoring system
            </p>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-6">
            {faqData.map((item, index) => {
              const isOpen = activeIndex === index || hoveredIndex === index;

              return (
                <motion.div
                  key={index}
                  className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  onClick={() => toggleFAQ(index)}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 hover:opacity-100 transition duration-500"></div>

                  <div className="relative p-6 z-10">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">
                        {item.question}
                      </h3>

                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20"
                      >
                        ↓
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <p className="text-slate-300 mt-4 leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="text-center mt-20">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-500 shadow-2xl"
              onClick={() => (window.location.href = "/contact")}
            >
              Still have questions? Contact Support
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}