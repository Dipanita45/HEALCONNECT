import React from 'react';
import Head from 'next/head';

const FAQ = () => {
  const faqs = [
    {
      question: "What is HEALCONNECT?",
      answer: "HEALCONNECT is a digital healthcare platform that connects patients with doctors for seamless appointment booking, prescription management, and remote health monitoring."
    },
    {
      question: "How do I book an appointment?",
      answer: "Navigate to the 'Appointments' section, select your preferred doctor, choose an available time slot, and confirm your booking."
    },
    {
      question: "Can I access my prescriptions online?",
      answer: "Yes! All your prescriptions are stored securely in the 'Prescriptions' section after your doctor issues them."
    },
    {
      question: "Is my health data secure?",
      answer: "Absolutely. We use end-to-end encryption and comply with HIPAA/GDPR standards to protect your sensitive health information."
    },
    {
      question: "How does remote monitoring work?",
      answer: "Connect your wearable devices or manually input vitals in the 'Monitoring' section. Your doctor can view this data in real-time during consultations."
    },
    {
      question: "What if I need emergency help?",
      answer: "HEALCONNECT is not for emergencies. In critical situations, please contact local emergency services immediately."
    },
    {
      question: "Can I share reports with multiple doctors?",
      answer: "Yes, you can securely share medical reports with any doctor in your network via the 'Share' option in your dashboard."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your registered email."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>HEALCONNECT - FAQs</title>
        <meta name="description" content="Frequently asked questions about HEALCONNECT" />
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about our platform</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-3 text-blue-600">Q{index + 1}.</span>
                {faq.question}
              </h3>
              <p className="text-gray-700 pl-10 border-l-4 border-blue-200">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-3">Still have questions?</h3>
          <p className="mb-4 text-gray-700">Contact our support team for personalized assistance</p>
          <button 
            onClick={() => window.location.href = '/contact'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;