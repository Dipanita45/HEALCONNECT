import Head from "next/head";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaUsers,
  FaHeartbeat,
  FaShieldAlt,
  FaChartLine,
  FaMobileAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaPlayCircle,
  FaDatabase,
  FaCloud,
  FaSync,
} from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description: "Sign up as a patient or doctor in just a few minutes",
      icon: <FaUsers />,
      color: "blue",
      features: ["Quick registration", "Secure authentication", "Profile setup"],
    },
    {
      number: "2",
      title: "Connect Your Devices",
      description: "Link your health monitoring devices to track vitals",
      icon: <FaMobileAlt />,
      color: "green",
      features: ["Bluetooth/WiFi", "Real-time sync", "Multiple devices"],
    },
    {
      number: "3",
      title: "Monitor Your Health",
      description: "Track your vital signs and health metrics 24/7",
      icon: <FaHeartbeat />,
      color: "red",
      features: ["Live monitoring", "Trend analysis", "Alerts"],
    },
    {
      number: "4",
      title: "Consult with Doctors",
      description: "Connect with healthcare professionals for expert advice",
      icon: <FaChartLine />,
      color: "purple",
      features: ["Virtual consultations", "Second opinions", "Expert advice"],
    },
    {
      number: "5",
      title: "Stay Protected",
      description: "Your data is secure and always accessible",
      icon: <FaShieldAlt />,
      color: "indigo",
      features: ["Data encryption", "HIPAA compliance", "Secure backup"],
    },
  ];

  const features = [
    { icon: <FaRocket />, title: "Fast Setup", desc: "Get started in minutes" },
    { icon: <FaMobileAlt />, title: "Mobile First", desc: "Access anywhere, anytime" },
    { icon: <FaDatabase />, title: "Secure Storage", desc: "Your data is protected" },
    { icon: <FaCloud />, title: "Cloud Sync", desc: "Automatic backup" },
    { icon: <FaSync />, title: "Real-time Updates", desc: "Instant synchronization" },
    { icon: <FaClock />, title: "24/7 Monitoring", desc: "Round-the-clock tracking" },
  ];

  return (
    <>
      <Head>
        <title>How It Works | HealConnect</title>
        <meta
          name="description"
          content="Learn how HealConnect works - Step by step guide to start monitoring your health"
        />
      </Head>

      <main className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 relative overflow-hidden pt-24">

        {/* Background Bubbles */}
        <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${300 - i * 50}px`,
                height: `${300 - i * 50}px`,
                top: `${-100 + i * 50}px`,
                left: `${-100 + i * 100}px`,
                background:
                  "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)",
                animationDelay: `${-i * 7}s`,
              }}
            />
          ))}
        </div>
        <style jsx>{`
  @keyframes floatSlow {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  .animate-float-slow {
    animation: floatSlow 6s ease-in-out infinite;
  }
  .animate-pulse-slow {
    animation: pulse 3s ease-in-out infinite;
  }
`}</style>


        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(30px, -30px) rotate(60deg);
            }
            66% {
              transform: translate(-20px, 20px) rotate(-30deg);
            }
          }
          .animate-float {
            animation: float 20s infinite ease-in-out;
          }
        `}</style>

        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* Hero Section */}
          <motion.header
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full shadow-lg">
                <FaRocket className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              <Typewriter
                words={["How It Works"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
              Get started with HealConnect in 5 simple steps and take control of your health journey
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
          </motion.header>

          {/* Steps Section */}
          <div className="max-w-7xl mx-auto mb-24 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
              How It Works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative flex flex-col items-center group"
                >
                  {/* Connection Lines */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-20 h-1 bg-gradient-to-r from-blue-400 via-gray-300 to-gray-300 dark:from-blue-400 dark:via-gray-600 dark:to-gray-700 -translate-y-1/2"></div>
                  )}

                  {/* Step Card */}
                  <div className={`
                    ${step.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                    ${step.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}
                    ${step.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                    ${step.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : ''}
                    ${step.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700' : ''}
                    p-6 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 ease-out relative z-10 text-center flex flex-col justify-between h-full 
                  `}>
                    {/* Step Number */}
                    <div className={`
                      ${step.color === 'blue' ? 'bg-blue-600 dark:bg-blue-400 text-white' : ''}
                      ${step.color === 'green' ? 'bg-green-600 dark:bg-green-400 text-white' : ''}
                      ${step.color === 'red' ? 'bg-red-600 dark:bg-red-400 text-white' : ''}
                      ${step.color === 'purple' ? 'bg-purple-600 dark:bg-purple-400 text-white' : ''}
                      ${step.color === 'indigo' ? 'bg-indigo-900 dark:bg-indigo-400 text-white' : ''}
                      w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4
                    `}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`text-4xl mb-4 ${step.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : step.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : step.color === "red"
                            ? "text-red-600 dark:text-red-400"
                            : step.color === "purple"
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-indigo-600 dark:text-indigo-400"
                        }`}
                    >
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-bold text-lg sm:text-xl mb-2 ${step.color === "blue"
                        ? "text-blue-800 dark:text-blue-200"
                        : step.color === "green"
                          ? "text-green-800 dark:text-green-200"
                          : step.color === "red"
                            ? "text-red-800 dark:text-red-200"
                            : step.color === "purple"
                              ? "text-purple-800 dark:text-purple-200"
                              : "text-indigo-800 dark:text-indigo-200"
                        }`}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2 w-full">
                      {step.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors"
                        >
                          <FaCheckCircle
                            className={`mr-2 ${step.color === "blue"
                              ? "text-blue-500"
                              : step.color === "green"
                                ? "text-green-500"
                                : step.color === "red"
                                  ? "text-red-500"
                                  : step.color === "purple"
                                    ? "text-purple-500"
                                    : "text-indigo-500"
                              }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>


          {/* Platform Features */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto mb-24 px-4"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
              Platform Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group p-6 rounded-2xl shadow-lg text-center flex flex-col items-center transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          overflow-hidden
        "
                >
                  {/* Animated Gradient Border */}
                  <span className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></span>

                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Icon with background */}
                    <div className="mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-3xl shadow-md transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg sm:text-xl mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4 mb-24"
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl overflow-hidden">
              {/* Animated background overlay */}
              <span className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-2xl animate-pulse-slow pointer-events-none"></span>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 relative z-10">
                Ready to Take Control of Your Health?
              </h2>

              {/* Subheading */}
              <p className="mb-8 text-blue-100 text-sm sm:text-base md:text-lg relative z-10">
                Join thousands of users who are already monitoring their health with HealConnect
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center justify-center shadow-md"
                >
                  <FaPlayCircle className="mr-2 text-lg sm:text-xl" />
                  Start Free Trial
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center shadow-md"
                >
                  <FaArrowRight className="mr-2 text-lg sm:text-xl" />
                  Learn More
                </motion.button>
              </div>

              {/* Floating animated circles */}
              <span className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></span>
              <span className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-float-slow delay-2000"></span>
            </div>
          </motion.section>

          {/* Move styles outside the motion.section */}

        </div>
      </main>
    </>
  );
}
