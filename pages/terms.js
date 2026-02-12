import Head from "next/head";
import { motion } from "framer-motion";
import { FaFileContract, FaGavel, FaBalanceScale, FaExclamationTriangle, FaHeartbeat, FaShieldAlt, FaUserCheck, FaClock, FaInfoCircle, FaLock, FaServer, FaChartLine, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBell, FaQuestionCircle, FaComments } from "react-icons/fa";
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

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms & Conditions | HealConnect</title>
        <meta name="description" content="HealConnect Terms and Conditions - Legal terms for using our healthcare platform" />
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
              <FaHeartbeat className="text-5xl text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-gray-100">
              <Typewriter
                words={["Terms & Conditions"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Please read these terms carefully before using HealConnect services.
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </motion.header>

          <div className="max-w-6xl mx-auto space-y-16">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-600 dark:bg-blue-400 text-white p-3 rounded-full mr-4">
                  <FaFileContract className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome to HealConnect
                </h2>
              </div>
              <p className="text-center text-gray-700 dark:text-gray-300 text-lg">
                These Terms & Conditions govern your use of our healthcare monitoring platform. 
                Please read them carefully to understand your rights and responsibilities.
              </p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Agreement to Terms */}
                <motion.section
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(147, 51, 234, 0.15)" }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-300 dark:border-purple-800 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                      <FaGavel className="text-xl text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Agreement to Terms
                    </h3>
                  </div>
                  <div className="space-y-3 text-gray-600 dark:text-gray-300">
                    <p className="font-medium">As a user of HealConnect, you agree to:</p>
                    <p className="leading-relaxed font-medium text-gray-700 dark:text-gray-400">
                      By accessing and using HealConnect, you agree to be bound by these Terms & Conditions.
                    </p>
                    <div className="bg-purple-200 dark:bg-purple-900/30 p-3 rounded-lg border-l-4 border-purple-600">
                      <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                        ⚠️ If you do not agree, you are prohibited from using this Service.
                      </p>
                    </div>
                  </div>
                </motion.section>

                {/* Description of Service */}
                <motion.section
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)" }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                      <FaHeartbeat className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      What We Offer
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Real-time health monitoring",
                      "Doctor-patient communication",
                      "Medical data storage",
                      "Appointment scheduling",
                      "Healthcare directory",
                      "Emergency alerts"
                    ].map((service, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300">{service}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* User Responsibilities */}
                <motion.section
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(34, 197, 94, 0.15)" }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-green-300 dark:border-green-800 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                      <FaUserCheck className="text-xl text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Your Responsibilities
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: FaInfoCircle, text: "Provide accurate information" },
                      { icon: FaLock, text: "Maintain account security" },
                      { icon: FaChartLine, text: "Use service responsibly" },
                      { icon: FaUserCheck, text: "Follow medical guidelines" },
                      { icon: FaExclamationTriangle, text: "Report issues promptly" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center space-x-3 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
                      >
                        <item.icon className="text-green-700 dark:text-green-400 text-lg" />
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-300">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Medical Disclaimer */}
                <motion.section
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(239, 68, 68, 0.15)" }}
                  className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl shadow-lg border-2 border-red-300 dark:border-red-800 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg mr-3">
                      <FaExclamationTriangle className="text-xl text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Medical Disclaimer
                    </h3>
                  </div>
                    <div className="bg-red-200 dark:bg-red-900/30 p-4 rounded-lg border-2 border-red-400 dark:border-red-700">
                      <p className="font-bold text-red-900 dark:text-red-200 mb-3 flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        IMPORTANT: Not a substitute for professional medical advice
                      </p>
                      <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                        <li className="flex items-center"><FaPhoneAlt className="mr-2 text-red-700 dark:text-red-600" /> Call 911 for medical emergencies</li>
                        <li className="flex items-center"><FaUserCheck className="mr-2 text-red-700 dark:text-red-600" /> Always consult qualified healthcare professionals</li>
                        <li className="flex items-center"><FaBalanceScale className="mr-2 text-red-700 dark:text-red-600" /> We&quot;re not liable for medical decisions</li>
                      </ul>
                    </div>
                </motion.section>

                {/* Privacy & Security */}
                <motion.section
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)" }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                      <FaShieldAlt className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Privacy & Security
                    </h3>
                  </div>
                  <div className="space-y-3 text-gray-800 dark:text-gray-300">
                    <p className="font-medium">Your data is protected with:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: FaLock, text: "End-to-end encryption" },
                        { icon: FaShieldAlt, text: "HIPAA compliance" },
                        { icon: FaServer, text: "Secure servers" },
                        { icon: FaChartLine, text: "Privacy controls" }
                      ].map((feature, index) => (
                        <div key={index} className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-center flex flex-col items-center justify-center border border-blue-200 dark:border-blue-700">
                          <feature.icon className="text-blue-700 dark:text-blue-600 mb-1" />
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-300">{feature.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* Limitation of Liability */}
                <motion.section
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(251, 146, 60, 0.15)" }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-orange-300 dark:border-orange-800 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg mr-3">
                      <FaBalanceScale className="text-xl text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Liability Limits
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
                    <div className="flex items-center"><FaInfoCircle className="mr-2 text-orange-700 dark:text-orange-600" /> Service provided &quot;as is&quot;</div>
                    <div className="flex items-center"><FaExclamationTriangle className="mr-2 text-orange-700 dark:text-orange-600" /> No warranties of any kind</div>
                    <div className="flex items-center"><FaBalanceScale className="mr-2 text-orange-700 dark:text-orange-600" /> Use at your own risk</div>
                  </div>
                </motion.section>
              </div>
            </div>

            {/* Important Legal Sections */}
            <div className="space-y-8">
              {/* Enhanced Termination Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(239, 68, 68, 0.15)" }}
                className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-xl border-2 border-red-200 dark:border-red-800 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mr-4">
                    <FaClock className="text-2xl text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Account Termination
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Understanding when and how accounts may be terminated</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Immediate Termination</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start"><FaExclamationTriangle className="mr-2 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" /> Violation of terms</li>
                      <li className="flex items-start"><FaExclamationTriangle className="mr-2 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" /> Illegal activities</li>
                      <li className="flex items-start"><FaExclamationTriangle className="mr-2 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" /> Security breaches</li>
                    </ul>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">User Rights</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start"><FaUserCheck className="mr-2 text-orange-600 dark:text-orange-500 mt-0.5 flex-shrink-0" /> Close account anytime</li>
                      <li className="flex items-start"><FaInfoCircle className="mr-2 text-orange-600 dark:text-orange-500 mt-0.5 flex-shrink-0" /> Export data before closure</li>
                      <li className="flex items-start"><FaBalanceScale className="mr-2 text-orange-600 dark:text-orange-500 mt-0.5 flex-shrink-0" /> Appeal process available</li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Enhanced Changes to Terms Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)" }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-800 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                    <FaFileContract className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Changes to Terms
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How we handle updates to our terms and conditions</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-blue-600 dark:text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Notification Process</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">We&quot;ll notify you of significant changes via email and in-app notifications at least 30 days before they take effect.</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-center border border-blue-200 dark:border-blue-700">
                      <FaEnvelope className="text-blue-700 dark:text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-300">Email Notice</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-center border border-blue-200 dark:border-blue-700">
                      <FaBell className="text-blue-700 dark:text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-300">In-App Alert</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-center border border-blue-200 dark:border-blue-700">
                      <FaClock className="text-blue-700 dark:text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-300">30-Day Notice</p>
                    </div>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                      ⚠️ Continued use of HealConnect after changes constitutes acceptance of the new terms.
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Enhanced Questions & Support Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600/30 via-blue-500/30 to-indigo-600/30 p-10 rounded-2xl text-gray-900 shadow-2xl backdrop-blur-sm dark:text-white"
            >
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                    <FaQuestionCircle className="text-4xl text-blue-600 dark:text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Have Questions?</h3>
                <p className="text-gray-800 dark:text-blue-100 text-lg max-w-2xl mx-auto">
                  Our legal and support teams are here to help you understand your rights and responsibilities.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center"
                >
                  <FaEnvelope className="text-3xl mb-3 mx-auto text-blue-600 dark:text-blue-200" />
                  <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Email Support</h4>
                  <p className="text-gray-700 dark:text-blue-100 mb-2">Get detailed responses</p>
                  <a href="mailto:legal@healconnect.com" className="text-blue-600 dark:text-white font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
                    legal@healconnect.com
                  </a>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center"
                >
                  <FaPhoneAlt className="text-3xl mb-3 mx-auto text-blue-600 dark:text-blue-200" />
                  <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Phone Support</h4>
                  <p className="text-gray-700 dark:text-blue-100 mb-2">Mon-Fri, 9AM-6PM EST</p>
                  <a href="tel:+911234567890" className="text-blue-600 dark:text-white font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
                    +91 1234567890
                  </a>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center"
                >
                  <FaComments className="text-3xl mb-3 mx-auto text-blue-600 dark:text-blue-200" />
                  <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Live Chat</h4>
                  <p className="text-gray-700 dark:text-blue-100 mb-2">Instant help available</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
                    Start Chat
                  </button>
                </motion.div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center mb-4">
                  <FaMapMarkerAlt className="text-2xl mr-3 text-blue-600 dark:text-blue-200" />
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">Corporate Office</h4>
                    <p className="text-gray-700 dark:text-blue-100">123 HealConnect, Bangalore.</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <FaClock className="mr-2 text-blue-600 dark:text-blue-200" />
                  <span className="text-gray-700 dark:text-blue-100">Response Time: Within 24 hours</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-4">
                <FaShieldAlt className="mr-2 text-blue-600 dark:text-blue-200" />
                <span className="text-sm text-gray-700 dark:text-blue-100">Confidential & Secure</span>
              </div>
            </motion.section>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
