import Head from "next/head";
import { motion } from "framer-motion";
import { FaShieldAlt, FaLock, FaDatabase, FaUserShield, FaHeartbeat, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaQuestionCircle, FaComments, FaClock, FaExclamationTriangle, FaInfoCircle, FaBalanceScale } from "react-icons/fa";
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

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | HealConnect</title>
        <meta name="description" content="HealConnect Privacy Policy - How we collect, use, and protect your health information" />
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
              <FaHeartbeat className="text-5xl text-green-600 dark:text-green-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <Typewriter
                words={["Privacy Policy"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Your privacy is our priority. Learn how we collect, use, and protect your health information.
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
          </motion.header>

          <div className="prose dark:prose-invert prose-lg max-w-4xl mx-auto space-y-12">

            {/* Information We Collect */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(34, 197, 94, 0.15)" }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-green-200 dark:border-green-800 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg mr-4">
                  <FaDatabase className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Information We Collect
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Understanding what data we gather</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                    </svg>
                    Personal Information
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Name, email, phone</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Date of birth, gender</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Emergency contacts</li>
                  </ul>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                    Health Information
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Vital signs</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Medical history</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Lab results</li>
                  </ul>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Technical Information
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>IP address</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Browser type</li>
                    <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Usage patterns</li>
                  </ul>
                </motion.div>
              </div>
            </motion.section>

            {/* How We Use Your Information */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.15)" }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                  <FaUserShield className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    How We Use Your Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Purpose and benefits of data usage</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-7a1 1 0 00-1-1h-3z"/>
                      </svg>
                    ), 
                    title: "Healthcare Services", 
                    desc: "Monitor health parameters" 
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                      </svg>
                    ), 
                    title: "Service Improvement", 
                    desc: "Enhance user experience" 
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    ), 
                    title: "Communication", 
                    desc: "Send health updates" 
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Security", 
                    desc: "Protect against fraud" 
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    ), 
                    title: "Legal Compliance", 
                    desc: "Meet regulations" 
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Personalization", 
                    desc: "Tailor healthcare experience" 
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, x: 5 }}
                    className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                  >
                    <div className="text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Data Protection */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(239, 68, 68, 0.15)" }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-red-200 dark:border-red-800 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg mr-4">
                  <FaLock className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Data Protection & Security
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Industry-standard security measures</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Encryption", 
                    desc: "End-to-end data protection",
                    color: "blue"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Access Controls", 
                    desc: "Authorized personnel only",
                    color: "green"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Regular Audits", 
                    desc: "Security assessments",
                    color: "blue"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "HIPAA Compliance", 
                    desc: "Healthcare regulations",
                    color: "green"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    ), 
                    title: "Secure Servers", 
                    desc: "Monitored facilities",
                    color: "blue"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zM10 13.586a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Data Backup", 
                    desc: "Regular secure backups",
                    color: "green"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className={`
                      ${item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400' : ''}
                      ${item.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-600 dark:text-green-400' : ''}
                      p-4 rounded-lg border text-center
                    `}
                  >
                    <div className="mb-3 flex justify-center">
                      {item.icon}
                    </div>
                    <h3 className={`
                      ${item.color === 'blue' ? 'text-blue-800 dark:text-blue-300' : ''}
                      ${item.color === 'green' ? 'text-green-800 dark:text-green-300' : ''}
                      font-semibold mb-2
                    `}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Your Rights */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(139, 92, 246, 0.15)" }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg mr-4">
                  <FaUserShield className="text-2xl text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Your Privacy Rights
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Control over your personal information</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Access", 
                    desc: "Request copy of your information",
                    color: "blue"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    ), 
                    title: "Correct", 
                    desc: "Update inaccurate information",
                    color: "green"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Delete", 
                    desc: "Request deletion of data",
                    color: "blue"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"/>
                      </svg>
                    ), 
                    title: "Port", 
                    desc: "Transfer data to another provider",
                    color: "green"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    ), 
                    title: "Opt-out", 
                    desc: "Choose how information is used",
                    color: "blue"
                  },
                  { 
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                      </svg>
                    ), 
                    title: "Restrict", 
                    desc: "Limit processing of your data",
                    color: "green"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className={`
                      ${item.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400' : ''}
                      ${item.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-600 dark:text-green-400' : ''}
                      p-4 rounded-lg border text-center
                    `}
                  >
                    <div className="mb-3 flex justify-center">
                      {item.icon}
                    </div>
                    <h3 className={`
                      ${item.color === 'blue' ? 'text-blue-800 dark:text-blue-300' : ''}
                      ${item.color === 'green' ? 'text-green-800 dark:text-green-300' : ''}
                      font-semibold mb-2
                    `}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              {/* Rights Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-700"
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"/>
                  </svg>
                  <p className="text-purple-800 dark:text-purple-200 text-sm font-medium">
                    You have full control over your personal health information. Exercise your rights anytime by contacting our privacy team.
                  </p>
                </div>
              </motion.div>
            </motion.section>

            
            {/* Privacy Priority Message */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(16, 185, 129, 0.15)" }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 transition-all duration-300"
            >
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="mr-4"
                >
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </motion.div>
                <p className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Your Privacy is Our Priority
                </p>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </>
  );
}
