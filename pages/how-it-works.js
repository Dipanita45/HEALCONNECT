import Head from "next/head";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaHeartbeat, FaShieldAlt, FaChartLine, FaMobileAlt, FaClock, FaCheckCircle, FaArrowRight, FaPlayCircle, FaDatabase, FaCloud, FaSync } from "react-icons/fa";
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

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description: "Sign up as a patient or doctor in just a few minutes",
      icon: <FaUsers />,
      color: "blue",
      features: ["Quick registration", "Secure authentication", "Profile setup"]
    },
    {
      number: "2",
      title: "Connect Your Devices",
      description: "Link your health monitoring devices to track vitals",
      icon: <FaMobileAlt />,
      color: "green",
      features: ["Bluetooth/WiFi", "Real-time sync", "Multiple devices"]
    },
    {
      number: "3",
      title: "Monitor Your Health",
      description: "Track your vital signs and health metrics 24/7",
      icon: <FaHeartbeat />,
      color: "red",
      features: ["Live monitoring", "Trend analysis", "Alerts"]
    },
    {
      number: "4",
      title: "Consult with Doctors",
      description: "Connect with healthcare professionals for expert advice",
      icon: <FaChartLine />,
      color: "purple",
      features: ["Virtual consultations", "Second opinions", "Expert advice"]
    },
    {
      number: "5",
      title: "Stay Protected",
      description: "Your data is secure and always accessible",
      icon: <FaShieldAlt />,
      color: "indigo",
      features: ["Data encryption", "HIPAA compliance", "Secure backup"]
    }
  ];

  const features = [
    { icon: <FaRocket />, title: "Fast Setup", desc: "Get started in minutes" },
    { icon: <FaMobileAlt />, title: "Mobile First", desc: "Access anywhere, anytime" },
    { icon: <FaDatabase />, title: "Secure Storage", desc: "Your data is protected" },
    { icon: <FaCloud />, title: "Cloud Sync", desc: "Automatic backup" },
    { icon: <FaSync />, title: "Real-time Updates", desc: "Instant synchronization" },
    { icon: <FaClock />, title: "24/7 Monitoring", desc: "Round-the-clock tracking" }
  ];

  return (
    <>
      <Head>
        <title>How It Works | HealConnect</title>
        <meta name="description" content="Learn how HealConnect works - Step by step guide to start monitoring your health" />
      </Head>

      <main className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 relative overflow-hidden">
        {/* Background with animated bubbles */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
          <div 
            className="absolute rounded-full"
            style={{
              width: '300px',
              height: '300px',
              top: '-100px',
              left: '-100px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '0s',
              zIndex: 0
            }}
          />
          <div 
            className="absolute rounded-full"
            style={{
              width: '200px',
              height: '200px',
              bottom: '50px',
              right: '10%',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '-7s',
              zIndex: 0
            }}
          />
          <div 
            className="absolute rounded-full"
            style={{
              width: '150px',
              height: '150px',
              top: '30%',
              right: '-50px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '-14s',
              zIndex: 0
            }}
          />
        </div>
        
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
        `}</style>
        
        <div className="container mx-auto px-6 py-16 relative" style={{ zIndex: 1 }}>
          <motion.header
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <FaRocket className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
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
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Get started with HealConnect in 5 simple steps and take control of your health journey
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </motion.header>

          {/* Steps Section */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-transparent transform -translate-x-1/2"></div>
                  )}
                  
                  {/* Step Card */}
                  <div className={`
                    ${step.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                    ${step.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}
                    ${step.color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
                    ${step.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : ''}
                    ${step.color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' : ''}
                    p-6 rounded-xl border-2 shadow-lg relative z-10 text-center
                  `}>
                    {/* Step Number */}
                    <div className={`
                      ${step.color === 'blue' ? 'bg-blue-600 dark:bg-blue-400 text-white' : ''}
                      ${step.color === 'green' ? 'bg-green-600 dark:bg-green-400 text-white' : ''}
                      ${step.color === 'red' ? 'bg-red-600 dark:bg-red-400 text-white' : ''}
                      ${step.color === 'purple' ? 'bg-purple-600 dark:bg-purple-400 text-white' : ''}
                      ${step.color === 'indigo' ? 'bg-indigo-600 dark:bg-indigo-400 text-white' : ''}
                      w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4
                    `}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className={`
                      ${step.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                      ${step.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                      ${step.color === 'red' ? 'text-red-600 dark:text-red-400' : ''}
                      ${step.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : ''}
                      ${step.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : ''}
                      text-3xl mb-3
                    `}>
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className={`font-bold text-lg mb-2 ${
                      step.color === 'blue' ? 'text-blue-800 dark:text-blue-200' : ''
                    }${step.color === 'green' ? 'text-green-800 dark:text-green-200' : ''
                    }${step.color === 'red' ? 'text-red-800 dark:text-red-200' : ''
                    }${step.color === 'purple' ? 'text-purple-800 dark:text-purple-200' : ''
                    }${step.color === 'indigo' ? 'text-indigo-800 dark:text-indigo-200' : ''
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {step.description}
                    </p>
                    
                    {/* Features */}
                    <ul className="space-y-1">
                      {step.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <FaCheckCircle className={`mr-2 ${
                            step.color === 'blue' ? 'text-blue-500' : ''
                          }${step.color === 'green' ? 'text-green-500' : ''
                          }${step.color === 'red' ? 'text-red-500' : ''
                          }${step.color === 'purple' ? 'text-purple-500' : ''
                          }${step.color === 'indigo' ? 'text-indigo-500' : ''
                          }`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="text-blue-600 dark:text-blue-400 text-2xl mb-3 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-2xl text-center text-white shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="mb-6 text-blue-100">
                Join thousands of users who are already monitoring their health with HealConnect
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <FaPlayCircle className="mr-2" />
                  Start Free Trial
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center"
                >
                  <FaArrowRight className="mr-2" />
                  Learn More
                </motion.button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </>
  );
}
