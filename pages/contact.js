import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaUserMd, FaAmbulance, FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaQuestionCircle, FaShieldAlt, FaUserFriends, FaComments, FaArrowRight, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
      staggerChildren: 0.1
    }
  }
};

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = [
    { value: "general", label: "General Inquiry", icon: FaQuestionCircle, color: "blue" },
    { value: "technical", label: "Technical Support", icon: FaExclamationTriangle, color: "orange" },
    { value: "billing", label: "Billing & Account", icon: FaUserMd, color: "green" },
    { value: "security", label: "Security & Privacy", icon: FaShieldAlt, color: "red" },
    { value: "feedback", label: "Feedback & Suggestions", icon: FaComments, color: "purple" }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email. You'll receive a secure link to reset your password within minutes.",
      category: "account"
    },
    {
      id: 2,
      question: "Is my health data secure and private?",
      answer: "Yes, we use industry-standard AES-256 encryption and comply with HIPAA regulations. Your data is never shared without your explicit consent and is stored in secure, SOC 2 certified data centers.",
      category: "security"
    },
    {
      id: 3,
      question: "How do I connect with my doctor?",
      answer: "Use the 'Find Doctors' feature in your dashboard to search and connect with healthcare providers. You can also invite your current doctor to join HealConnect using their email.",
      category: "general"
    },
    {
      id: 4,
      question: "What should I do in a medical emergency?",
      answer: "For any medical emergency, call 911 immediately or go to the nearest emergency room. HealConnect is not designed for emergency medical situations.",
      category: "emergency"
    },
    {
      id: 5,
      question: "How quickly will support respond?",
      answer: "Our support team typically responds within 2-4 hours during business hours and within 24 hours for non-urgent inquiries. Priority issues are handled immediately.",
      category: "support"
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Please provide more details (at least 20 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus({
        type: "success",
        message: "Thank you for contacting us. We'll get back to you within 24 hours."
      });
      setShowSuccessModal(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "normal",
        category: "general"
      });
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-100 text-gray-700 border-gray-300",
      normal: "bg-blue-100 text-blue-700 border-blue-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      urgent: "bg-red-100 text-red-700 border-red-300"
    };
    return colors[priority] || colors.normal;
  };

  const getCategoryIcon = (category) => {
    const found = categories.find(cat => cat.value === category);
    return found ? found.icon : FaQuestionCircle;
  };

  return (
    <>
      <Head>
        <title>Contact Support | HealConnect</title>
        <meta name="description" content="Contact HealConnect support team for help with your healthcare monitoring needs" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <motion.section 
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-green-600 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-6 py-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div variants={fadeInUp} className="flex justify-center mb-6">
                <div className="relative">
                  <FaHeartbeat className="text-6xl animate-pulse" />
                  <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                </div>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl font-bold mb-6">
                How Can We Help You Today?
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Our dedicated support team is here to assist you with any questions, concerns, or feedback. 
                We&apos;re committed to providing you with the best possible experience.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-lg" />
                    <span className="font-medium">24/7 Support Available</span>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-lg" />
                    <span className="font-medium">Fast Response Time</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/10 rounded-full blur-lg"></div>
        </motion.section>

          {/* Quick Contact Cards */}
        <motion.section 
          className="container mx-auto px-6 -mt-10 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emergency Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)" }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800 hover:border-red-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                  <FaAmbulance className="text-2xl text-red-600 dark:text-red-400" />
                </div>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold px-2 py-1 rounded-full">
                  EMERGENCY
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Medical Emergency</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">For life-threatening situations, call immediately</p>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">102</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">Emergency Services</p>
              </div>
            </motion.div>

            {/* Phone Support Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-800 hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <FaPhone className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                  24/7
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Round-the-clock assistance for urgent issues</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">+91 1234567890</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Toll-Free Hotline</p>
              </div>
            </motion.div>

            {/* Office Hours Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-800 hover:border-green-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <FaClock className="text-2xl text-green-600 dark:text-green-400" />
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full">
                  BUSINESS
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Office Hours</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">When our team is available</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mon - Fri</span>
                  <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                  <span className="font-medium text-gray-500 dark:text-gray-500">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

          {/* Main Content */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-blue-100/70 dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-blue-300/80 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Send Us a Message</h2>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <FaEnvelope className="text-xl text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                              formData.category === category.value
                                ? `border-${category.color}-500 bg-${category.color}-50 dark:bg-${category.color}-900/20`
                                : 'border-gray-400 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-500'
                            }`}
                          >
                            <Icon className={`text-xl ${
                              formData.category === category.value
                                ? `text-${category.color}-600 dark:text-${category.color}-400`
                                : 'text-gray-400 dark:text-gray-500'
                            }`} />
                            <span className={`text-xs font-medium ${
                              formData.category === category.value
                                ? `text-${category.color}-700 dark:text-${category.color}-300`
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {category.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.name && touched[name]
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-400 dark:border-gray-600 focus:ring-blue-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                        placeholder="Dipanita"
                      />
                      {errors.name && touched.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.email && touched.email
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-400 dark:border-gray-600 focus:ring-blue-500'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                        placeholder="dipanita@example.com"
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 rounded-lg border-2 ${
                        errors.subject && touched.subject
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-400 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && touched.subject && (
                      <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                    )}
                  </div>

                  {/* Priority Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Level
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "low", label: "Low - General Inquiry" },
                        { value: "normal", label: "Normal - Technical Support" },
                        { value: "high", label: "High - Account Issue" },
                        { value: "urgent", label: "Urgent - Service Disruption" }
                      ].map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                            formData.priority === priority.value
                              ? getPriorityColor(priority.value)
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border-2 resize-none ${
                        errors.message && touched.message
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-400 dark:border-gray-600 focus:ring-blue-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="Please describe your issue or question in detail..."
                    />
                    {errors.message && touched.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formData.message.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaArrowRight />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Information */}
              <div className="bg-blue-100/70 dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-blue-300/80 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Other Ways to Reach Us</h3>
                
                <div className="space-y-4">
                  <a href="mailto:support@healconnect.com" className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group border-2 border-blue-200/50 dark:border-gray-600">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaEnvelope className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Email Support</h4>
                      <p className="text-blue-600 dark:text-blue-400">support@healconnect.com</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Response within 24 hours</p>
                    </div>
                  </a>

                  <a href="mailto:doctors@healconnect.com" className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group border-2 border-green-200/50 dark:border-gray-600">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <FaUserMd className="text-xl text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Doctor Support</h4>
                      <p className="text-green-600 dark:text-green-400">doctors@healconnect.com</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Healthcare provider inquiries</p>
                    </div>
                  </a>

                  <div className="flex items-start space-x-4 p-4 rounded-lg border-2 border-red-200/50 dark:border-gray-600">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                      <FaMapMarkerAlt className="text-xl text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Office Location</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Healthcare Ave<br />
                        District,Bengal<br />
                        India.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-blue-100/70 dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-blue-300/80 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
                
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => setSelectedFAQ(selectedFAQ === faq.id ? null : faq.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {faq.question}
                        </span>
                        <FaArrowRight className={`text-gray-400 transition-transform duration-200 ${
                          selectedFAQ === faq.id ? 'rotate-90' : ''
                        }`} />
                      </button>
                      
                      <AnimatePresence>
                        {selectedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-3xl text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent Successfully!
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for contacting us. We&apos;ve received your message and will get back to you within 24 hours.
                  </p>
                  
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
