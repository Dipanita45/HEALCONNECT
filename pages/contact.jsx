import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";

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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Integrate with backend or service if needed
  };

  return (
    <>
      <Head>
        <title>Contact | HealConnect</title>
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
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-green-700">
              Contact &amp; Healthcare Support
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Reach out for support, partnership, or to contribute to HealConnect’s mission.
            </p>
            <div className="mx-auto w-24 h-1 mt-4 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
          </motion.header>

          <div className="prose dark:prose-invert prose-lg max-w-4xl mx-auto space-y-12">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="transition-transform duration-300 ease-in-out cursor-default"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center md:text-left text-green-700">
                Get in Touch
              </h2>
              <p className="text-lg leading-relaxed mb-2">Email: <a href="mailto:support@healconnect.com" className="text-blue-600">support@healconnect.com</a></p>
              <p className="text-lg leading-relaxed mb-2">Phone: <a href="tel:+911234567890" className="text-blue-600">+91 12345 67890</a></p>
              /<p className="text-lg leading-relaxed mb-2">GitHub: <a href="https://github.com/Ashish001sing/HEALCONNECT" target="_blank" rel="noopener noreferrer" className="text-blue-600">HEALCONNECT</a></p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="transition-transform duration-300 ease-in-out cursor-default"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center md:text-left text-green-700">
                Send Us a Message
              </h2>
              {submitted ? (
                <p style={{ color: "green" }}>Thank you for reaching out! We&#39;ll get back to you soon.</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition">Send Message</button>
                </form>
              )}
            </motion.section>

            
          </div>
        </div>
      </main>
    </>
  );
}
