export const generateAIResponse = (message) => {
  const lowerMsg = message.toLowerCase();

  // Emergency triggers
  if (lowerMsg.match(/(chest pain|heart attack|stroke|breathing|suicide|bleeding heavily|emergency)/)) {
    return {
      text: "This sounds like a medical emergency. Please call your local emergency services (e.g., 112 or 911) or go to the nearest hospital immediately.",
      isEmergency: true,
      isTip: false
    };
  }

  // Symptoms
  if (lowerMsg.match(/(headache|migraine)/)) {
    return {
      text: "For a headache, make sure you are hydrated and resting in a quiet, dark room. If it's sudden and severe, or accompanied by fever or vision changes, please consult a doctor.",
      isEmergency: false,
      isTip: false
    };
  }
  
  if (lowerMsg.match(/(fever|temperature)/)) {
    return {
      text: "If you have a fever, rest and drink plenty of fluids. You can take over-the-counter fever reducers if needed. Seek medical attention if your fever is over 103°F (39.4°C) or lasts more than 3 days.",
      isEmergency: false,
      isTip: false
    };
  }

  // Appointments
  if (lowerMsg.match(/(appointment|book|schedule|doctor)/)) {
    return {
      text: "You can book an appointment with our specialists through the 'Find Doctors' section on your dashboard. Would you like me to guide you there?",
      isEmergency: false,
      isTip: false
    };
  }

  // Health Tips
  if (lowerMsg.match(/(tip|diet|exercise|healthy|health)/)) {
    return {
      text: "Here's a health tip: Aim for at least 30 minutes of moderate physical activity every day and keep yourself hydrated by drinking at least 8 glasses of water.",
      isEmergency: false,
      isTip: true
    };
  }

  // Greetings
  if (lowerMsg.match(/(hello|hi|hey|greetings)/)) {
    return {
      text: "Hello! I'm your HEALCONNECT AI Assistant. I can help you with symptom suggestions, health tips, and appointment guidance. How can I help you today?",
      isEmergency: false,
      isTip: false
    };
  }

  // Fallback
  return {
    text: "I'm a basic medical assistant. I can provide general health tips, symptom guidance, and help you navigate the HEALCONNECT platform. Please note that I cannot replace a professional medical diagnosis.",
    isEmergency: false,
    isTip: false
  };
};
