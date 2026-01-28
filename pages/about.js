import Head from "next/head";
import Footer from "./footer";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaHeartbeat, FaHospital, FaUsers, FaShieldAlt, FaGlobe, FaRocket, FaStethoscope, FaChartLine, FaHandHoldingMedical, FaClock, FaCheckCircle, FaArrowRight, FaLightbulb } from "react-icons/fa";

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function About() {
  const features = [
    {
      icon: <FaHeartbeat />,
      title: "Real-time Monitoring",
      description: "Track vital signs and health parameters in real-time for immediate medical attention",
      color: "red"
    },
    {
      icon: <FaHospital />,
      title: "Hospital Management",
      description: "Comprehensive system for hospitals to manage multiple patients efficiently",
      color: "blue"
    },
    {
      icon: <FaUsers />,
      title: "Doctor Access",
      description: "Global access for doctors to monitor patients remotely and provide timely care",
      color: "green"
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Platform",
      description: "Enterprise-grade security to protect sensitive patient health information",
      color: "purple"
    }
  ];

  const stats = [
    { number: "24/7", label: "Monitoring", icon: <FaClock /> },
    { number: "100+", label: "Hospitals", icon: <FaHospital /> },
    { number: "50K+", label: "Patients", icon: <FaUsers /> },
    { number: "99.9%", label: "Uptime", icon: <FaCheckCircle /> }
  ];

  const timeline = [
    {
      year: "2025",
      title: "Foundation",
      description: "HealConnect was founded with a vision to revolutionize healthcare monitoring",
      icon: <FaRocket />
    },
    {
      year: "2025",
      title: "Launch",
      description: "Successfully launched the WeCare Kit and monitoring platform",
      icon: <FaStethoscope />
    },
    {
      year: "2025",
      title: "Growth",
      description: "Expanded to serve hospitals across Pune with advanced features",
      icon: <FaChartLine />
    },
    {
      year: "2025",
      title: "Innovation",
      description: "Continuous improvement with AI-powered health insights",
      icon: <FaLightbulb />
    }
  ];

  return (
    <>
      <Head>
        <title>About | HealConnect</title>
        <meta name="description" content="Learn about HealConnect's mission to revolutionize healthcare monitoring in Pune and beyond" />
      </Head>

      <main className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
          <div 
            className="absolute rounded-full opacity-20"
            style={{
              width: '400px',
              height: '400px',
              top: '-200px',
              left: '-200px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
              animation: 'float 25s infinite ease-in-out',
              animationDelay: '0s'
            }}
          />
          <div 
            className="absolute rounded-full opacity-20"
            style={{
              width: '300px',
              height: '300px',
              bottom: '-150px',
              right: '-100px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
              animation: 'float 20s infinite ease-in-out',
              animationDelay: '-5s'
            }}
          />
          <div 
            className="absolute rounded-full opacity-20"
            style={{
              width: '250px',
              height: '250px',
              top: '40%',
              right: '-125px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
              animation: 'float 30s infinite ease-in-out',
              animationDelay: '-10s'
            }}
          />
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(30px, -30px) rotate(120deg);
            }
            66% {
              transform: translate(-20px, 20px) rotate(240deg);
            }
          }
        `}</style>

        <div className="container mx-auto px-6 py-16 relative" style={{ zIndex: 1 }}>
          {/* Enhanced Header */}
          <motion.header
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full shadow-lg">
                <FaHeartbeat className="text-4xl text-white animate-pulse" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
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
            
            <motion.p 
              className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Revolutionizing healthcare monitoring in Pune and beyond. We're connecting patients with doctors through innovative technology.
            </motion.p>
            
            <motion.div 
              className="mx-auto w-32 h-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "8rem" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            />
          </motion.header>

          {/* Stats Section */}
          <motion.section
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                  }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center cursor-pointer"
                >
                  <div className="text-green-600 dark:text-green-400 text-2xl mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Mission Section */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                  <FaRocket className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                HealConnect is Pune's growing health monitoring site to help hospitals manage their patients' health parameters anytime, anywhere. 
                Our goal is to make patients' health data accessible to doctors worldwide for quicker diagnosis and treatment.
              </p>
            </div>
          </motion.section>

          {/* Features Grid */}
          <motion.section
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  className={`
                    bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 cursor-pointer
                    transition-all duration-300 hover:shadow-2xl
                    ${feature.color === 'red' ? 'border-red-200 dark:border-red-800 hover:border-red-400' : ''}
                    ${feature.color === 'blue' ? 'border-blue-200 dark:border-blue-800 hover:border-blue-400' : ''}
                    ${feature.color === 'green' ? 'border-green-200 dark:border-green-800 hover:border-green-400' : ''}
                    ${feature.color === 'purple' ? 'border-purple-200 dark:border-purple-800 hover:border-purple-400' : ''}
                  `}
                >
                  <div className={`
                    text-3xl mb-4 flex justify-center
                    ${feature.color === 'red' ? 'text-red-600 dark:text-red-400' : ''}
                    ${feature.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                    ${feature.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}
                    ${feature.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : ''}
                  `}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* What We Do Section */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                  <FaHandHoldingMedical className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  What We Do
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                The HealConnect system's kit allows doctors or nurses to measure the patient's body temperature and heart rate. 
                This real-time data is automatically updated on the WeCare platform, which doctors and hospitals can access remotely.
              </p>
              <motion.div 
                className="mt-6 flex items-center text-blue-600 dark:text-blue-400 cursor-pointer"
                whileHover={{ x: 10 }}
              >
                <span className="font-medium">Learn more about our technology</span>
                <FaArrowRight className="ml-2" />
              </motion.div>
            </div>
          </motion.section>

          {/* Timeline */}
          <motion.section
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
              Our Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {item.year}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Legal Section */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Terms & Conditions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing this website, you agree to our terms and conditions, applicable laws, and local regulations. 
                  If you do not agree, you are prohibited from using the site.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                  Content Copyright
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The site design, logo, and video content are subject to copyright © 2025–present | HealConnect LLC
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 rounded-2xl text-center text-white shadow-2xl">
              <div className="flex justify-center mb-4">
                <FaGlobe className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4">
                Join the Healthcare Revolution
              </h2>
              <p className="mb-6 text-green-100">
                Be part of the future of healthcare monitoring in Pune and beyond
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Get Started Today
              </motion.button>
            </div>
          </motion.section>
        </div>
        <Footer />
      </main>
    </>
  );
}
