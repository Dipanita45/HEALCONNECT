import React, { useState } from 'react';

const faqData = [
  {
    question: 'How does HealConnect monitor my health remotely?',
    answer:
      'Our health monitoring kit measures vital parameters and sends the data securely to doctors who can access it anytime via the HealConnect platform.',
  },
  {
    question: 'What health parameters does the HealConnect kit measure?',
    answer:
      'It measures body temperature, heart rate, and pulse rate—all in a single device for convenience and accuracy.',
  },
  {
    question: 'Is my personal and health data secure on HealConnect?',
    answer:
      'Yes, we maintain end-to-end security protocols to ensure your data is accessible only to authorized doctors and yourself.',
  },
  {
    question: 'Can doctors and patients both access the monitoring data?',
    answer:
      'Yes, both parties can view health data in real-time through our website for effective monitoring and timely treatment.',
  },
  {
    question: 'How quickly can treatment be initiated using HealConnect?',
    answer:
      'Real-time monitoring helps doctors act immediately, improving treatment response and outcomes.',
  },
  {
    question: 'Who can use the HealConnect system?',
    answer:
      'HealConnect is designed for healthcare organizations, doctors, and patients looking for a reliable remote health monitoring solution.',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 font-sans" id="faq">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
          ❓ FAQ
        </div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Everything you need to know about HealConnect's remote health monitoring solution
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
              activeIndex === index ? 'shadow-xl ring-2 ring-blue-500/20' : ''
            }`}
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center p-6 cursor-pointer"
            >
              <h3 className="font-semibold text-slate-900 text-lg pr-8 group-hover:text-blue-900 transition-colors">
                {item.question}
              </h3>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-blue-600 text-white rotate-180' 
                  : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                <svg 
                  className="w-4 h-4 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out ${
              activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}>
              <div className="px-6 pb-6 pt-0">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>
                <p className="text-slate-700 leading-relaxed text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
          <span>Still have questions? Contact us</span>
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}