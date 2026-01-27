import Head from "next/head";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUserMd, FaAmbulance, FaHeartbeat } from "react-icons/fa";
import { useState } from "react";
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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage("Thank you for contacting us. We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "normal"
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Contact Support | HealConnect</title>
        <meta name="description" content="Contact HealConnect support team for help with your healthcare monitoring needs" />
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
            <div className="flex justify-center mb-4">
              <FaHeartbeat className="text-5xl text-green-600 dark:text-green-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              <Typewriter
                words={["Contact Support"]}
                loop={1}
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              We're here to help. Reach out to our support team for any questions or assistance.
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(239, 68, 68, 0.3)" }}
              className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 transition-transform duration-300 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <FaAmbulance className="text-3xl text-red-600 dark:text-red-400 mr-3" />
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Emergency</h3>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-red-700 dark:text-red-300">Medical Emergency?</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-200">911</p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Call immediately for life-threatening emergencies
                </p>
              </div>
            </motion.div>

            {/* Phone Support */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)" }}
              className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 transition-transform duration-300 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <FaPhone className="text-3xl text-blue-600 dark:text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">Phone Support</h3>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-blue-700 dark:text-blue-300">24/7 Hotline</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">+1 (555) 123-4567</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Available round the clock for urgent issues
                </p>
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)" }}
              className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800 transition-transform duration-300 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <FaClock className="text-3xl text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Office Hours</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-green-700 dark:text-green-300">Business Hours:</p>
                <p className="text-green-600 dark:text-green-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-green-600 dark:text-green-400">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-green-600 dark:text-green-400">Sunday: Closed</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg border border-green-300 dark:border-green-600">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority Level
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="low">Low - General Inquiry</option>
                    <option value="normal">Normal - Technical Support</option>
                    <option value="high">High - Account Issue</option>
                    <option value="urgent">Urgent - Service Disruption</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please describe your issue or question in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Other Ways to Reach Us</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <FaEnvelope className="text-2xl text-green-600 dark:text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email Support</h3>
                      <p className="text-gray-600 dark:text-gray-400">support@healconnect.com</p>
                      <p className="text-sm">Response time: Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <FaUserMd className="text-2xl text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Doctor Support</h3>
                      <p className="text-gray-600 dark:text-gray-400">doctors@healconnect.com</p>
                      <p className="text-sm">For healthcare provider inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <FaMapMarkerAlt className="text-2xl text-red-600 dark:text-red-400 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Office Location</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Healthcare Ave<br />
                        Medical District, CA 94102<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-green-600 dark:hover:text-green-400">
                      How do I reset my password?
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                      Click "Forgot Password" on the login page and follow the instructions sent to your email.
                    </p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-green-600 dark:hover:text-green-400">
                      Is my health data secure?
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                      Yes, we use industry-standard encryption and comply with HIPAA regulations to protect your data.
                    </p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-green-600 dark:hover:text-green-400">
                      How do I connect with my doctor?
                    </summary>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                      Use the "Find Doctors" feature in your dashboard to search and connect with healthcare providers.
                    </p>
                  </details>
                </div>
              </div>
            </motion.div>
          </div>

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
      </main>
    </>
  );
}
