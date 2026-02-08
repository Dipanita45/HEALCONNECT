
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Appointments.module.css';
import Image from 'next/image';
import { auth } from "../lib/firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

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

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Sample doctor data
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    available: true,
    nextAvailable: "Today, 3:00 PM",
    experience: "12 years",
    rating: 4.8,
    reviews: 124,
    availability: {
  monday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" }
  ],
  tuesday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" }
  ],
  wednesday: [
    { start: "09:00", end: "12:00" }
  ],
  thursday: [
    { start: "13:00", end: "17:00" }
  ],
  friday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" }
  ]
}
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    available: false,
    nextAvailable: "Tomorrow, 10:00 AM",
    experience: "8 years",
    rating: 4.6,
    reviews: 98,
    availability: {
  monday: [
    { start: "10:00", end: "14:00" }
  ],
  tuesday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "16:00" }
  ],
  wednesday: [],
  thursday: [
    { start: "09:00", end: "12:00" }
  ],
  friday: [
    { start: "13:00", end: "17:00" }
  ]
}   
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    available: true,
    nextAvailable: "Today, 5:30 PM",
    experience: "10 years",
    rating: 4.9,
    reviews: 156,
    availability: {
  monday: [
    { start: "08:00", end: "12:00" },
    { start: "13:00", end: "15:00" }
  ],
  tuesday: [
    { start: "10:00", end: "14:00" }
  ],
  wednesday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" }
  ],
  thursday: [],
  friday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "16:00" }
  ]
}
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    available: true,
    nextAvailable: "Today, 1:00 PM",
    experience: "15 years",
    rating: 4.7,
    reviews: 203,
    availability: {
  monday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" }
  ],
  tuesday: [
    { start: "09:00", end: "12:00" }
  ],
  wednesday: [
    { start: "13:00", end: "17:00" }
  ],
  thursday: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "16:00" }
  ],
  friday: [
    { start: "10:00", end: "14:00" }
  ]
} 
  }
];

const getDayFromDate = (date) => {
  return new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
};

const filterTimesByAvailability = (times, doctor, date) => {
  if (!doctor || !date) return times;

  const day = getDayFromDate(date);
  const windows = doctor.availability?.[day];

  // Doctor not working that day
  if (!windows || windows.length === 0) return [];

  return times.filter((time) => {
    const [value, period] = time.split(" ");
    let [hours, minutes] = value.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    const timeInMinutes = hours * 60 + (minutes || 0);

    // ✅ check against ANY availability window
    return windows.some(({ start, end }) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;

      return (
        timeInMinutes >= startMinutes &&
        timeInMinutes <= endMinutes
      );
    });
  });
};

export default function Appointments() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    doctor: '',
    reason: ''
  });

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [step, setStep] = useState(1); // 1: select doctor, 2: book appointment
  const [formErrors, setFormErrors] = useState({});
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH USER:", user);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (formData.date && formData.doctor) {
      fetchBookedSlots(formData.date, formData.doctor);
    }
  }, [formData.date, formData.doctor]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.reason.trim()) errors.reason = 'Reason is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ ...formData, doctor: doctor.name });
    setStep(2);
  };

  const handleBackToDoctors = () => {
    setSelectedDoctor(null);
    setStep(1);
    setFormErrors({});
  };
 
 const isSlotAlreadyBooked = async () => {
  const q = query(
    collection(db, "appointments"),
    where("date", "==", formData.date),
    where("doctorName", "==", formData.doctor),
    where("time", "==", formData.time)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
  setIsSubmitting(true);

  const alreadyBooked = await isSlotAlreadyBooked();

  if (alreadyBooked) {
    alert("This time slot is already booked. Please choose another.");
    setIsSubmitting(false);
    return;
  }

  // 👉 IMPORTANT: save appointment
  await addDoc(collection(db, "appointments"), {
    name: formData.name,
    date: formData.date,
    time: formData.time,
    doctorName: formData.doctor,
    reason: formData.reason,
    createdAt: new Date()
  });

  const successElement = document.getElementById("booking-success");
  successElement.style.display = "flex";

  setTimeout(() => {
    successElement.style.display = "none";
    alert("Appointment booked successfully!");

    setFormData({
      name: "",
      date: "",
      time: "",
      doctor: "",
      reason: ""
    });

    setStep(1);
    setSelectedDoctor(null);
    setFormErrors({});
    setBookedTimes([]);
    setIsSubmitting(false);
  }, 2000);
};

  const fetchBookedSlots = async (date, doctor) => {
  if (!date || !doctor) return;

  try {
    const q = query(
      collection(db, "appointments"),
      where("date", "==", date),
      where("doctorName", "==", doctor)
    );

    const snapshot = await getDocs(q);
    const times = snapshot.docs.map(doc => doc.data().time);

    setBookedTimes(times);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
  }
};


   const availableTimes = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  return (
    <div className={styles.container}>
      {/* Navbar spacer to prevent content from hiding behind fixed navbar */}
      <div className={styles.navbarSpacer}></div>
      
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>

      <motion.header
        className={styles.header}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className={styles.title}>
          Book <span className={styles.titleAccent}>Appointment</span>
        </h1>
        <p className={styles.subtitle}>
          Schedule your visit with our expert healthcare professionals
        </p>
        <div className={styles.titleUnderline}></div>
      </motion.header>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.section
              key="doctors-section"
              className={styles.doctorsSection}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerChildren}
            >
              <motion.div 
                className={styles.titleContainer}
                variants={fadeInUp}
              >
                <motion.h2 
                  className={styles.sectionTitle}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <span className={styles.titlePrefix}>Meet</span>
                  <span className={styles.titleMain}>Our Specialist Doctors</span>
                </motion.h2>
                <motion.div 
                  className={styles.titleUnderline}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                ></motion.div>
                <motion.p 
                  className={styles.sectionSubtitle}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  Choose from our team of board-certified healthcare professionals
                </motion.p>
              </motion.div>
              
              <div className={styles.doctorsGrid}>
                {doctors.map((doctor) => (
                  <motion.div 
                    key={doctor.id} 
                    className={styles.doctorCard}
                    variants={fadeInUp}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className={styles.doctorImage}>
                      <Image 
                        src={doctor.image} 
                        alt={doctor.name} 
                        width={200}
                        height={200}
                        className={styles.image}
                      />
                      <div className={`${styles.availability} ${doctor.available ? styles.available : styles.unavailable}`}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                    <div className={styles.doctorInfo}>
                      <h3>{doctor.name}</h3>
                      <p className={styles.specialty}>{doctor.specialty}</p>
                      <div className={styles.rating}>
                        <span className={styles.stars}>★★★★★</span>
                        <span className={styles.ratingText}>{doctor.rating} ({doctor.reviews} reviews)</span>
                      </div>
                      <p className={styles.experience}>{doctor.experience} experience</p>
                      <p className={styles.nextAvailable}>
                        {doctor.available ? `Next available: ${doctor.nextAvailable}` : `Available: ${doctor.nextAvailable}`}
                      </p>
                    </div>
                    <motion.button 
                      className={styles.selectButton}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {doctor.available ? 'Select Doctor' : 'View Profile'}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="booking-section"
              className={styles.bookingSection}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={scaleIn}
            >
              <div className={styles.bookingHeader}>
                <motion.button 
                  onClick={handleBackToDoctors} 
                  className={styles.backButton}
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to Doctors
                </motion.button>
                <h2 className={styles.sectionTitle}>Book with {selectedDoctor.name}</h2>
                <p className={styles.selectedDoctorSpecialty}>{selectedDoctor.specialty}</p>
              </div>

              <div className={styles.bookingContent}>
                <motion.form 
                  onSubmit={handleSubmit} 
                  className={styles.form}
                  variants={staggerChildren}
                  initial="hidden"
                  animate="visible"
                >
                 
                  <motion.div 
                    className={styles.formRow}
                    variants={formItemVariants}
                  >
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`${styles.formInput} ${formErrors.name ? styles.error : ''}`}
                        placeholder=" "
                      />
                      <label className={styles.formLabel}>Patient Full Name</label>
                      <div className={styles.formUnderline}></div>
                      {formErrors.name && <span className={styles.errorText}>{formErrors.name}</span>}
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className={`${styles.formInput} ${formErrors.date ? styles.error : ''}`}
                        min={new Date().toISOString().split('T')[0]}
                        placeholder=" "
                      />
                      <label className={styles.formLabel}>Appointment Date</label>
                      <div className={styles.formUnderline}></div>
                      {formErrors.date && <span className={styles.errorText}>{formErrors.date}</span>}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className={styles.formRow}
                    variants={formItemVariants}
                  >
                    <div className={styles.inputGroup}>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className={`${styles.formInput} ${formErrors.time ? styles.error : ''}`}
                      >
                        <option value="">Select Time</option>
                          {filterTimesByAvailability(
                              availableTimes,
                               selectedDoctor,
                             formData.date
                            ).map(time => (
                            <option
                            key={time}
                             value={time}
                            disabled={bookedTimes.includes(time)}
                          >
                          {time} {bookedTimes.includes(time) ? "(Booked)" : ""}
                           </option>
                       ))}
                      </select>
                      <label className={styles.formLabel}>Preferred Time</label>
                      <div className={styles.formUnderline}></div>
                      {formErrors.time && <span className={styles.errorText}>{formErrors.time}</span>}
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                        className={`${styles.formInput} ${formErrors.reason ? styles.error : ''}`}
                        placeholder=" "
                      />
                      <label className={styles.formLabel}>Reason for Visit</label>
                      <div className={styles.formUnderline}></div>
                      {formErrors.reason && <span className={styles.errorText}>{formErrors.reason}</span>}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className={styles.selectedDoctorSummary}
                    variants={formItemVariants}
                  >
                    <div className={styles.summaryImage}>
                      <Image 
                        src={selectedDoctor.image} 
                        alt={selectedDoctor.name}
                        width={120} 
                        height={120}
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.summaryInfo}>
                      <h4>{selectedDoctor.name}</h4>
                      <p>{selectedDoctor.specialty}</p>
                      <div className={styles.availability}>
                        Status: <span className={selectedDoctor.available ? styles.availableText : styles.unavailableText}>
                          {selectedDoctor.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.button 
                    type="submit" 
                    className={styles.submitButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!selectedDoctor.available || isSubmitting}
                    variants={formItemVariants}
                  >
                    {isSubmitting ? (
                      <div className={styles.spinner}></div>
                    ) : (
                      <>
                        Confirm Appointment
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </motion.button>
                </motion.form>
                
                <motion.div 
                  className={styles.doctorDetails}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                >
                  <h3>About Dr. {selectedDoctor.name.split(' ')[1]}</h3>
                  <p className={styles.doctorBio}>
                    {selectedDoctor.name} is a renowned {selectedDoctor.specialty.toLowerCase()} with over {selectedDoctor.experience} of experience. 
                    Specializing in patient-centered care, Dr. {selectedDoctor.name.split(' ')[1]} has helped thousands of patients 
                    achieve better health outcomes.
                  </p>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Specialty:</span>
                    <span className={styles.detailValue}>{selectedDoctor.specialty}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Experience:</span>
                    <span className={styles.detailValue}>{selectedDoctor.experience}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Rating:</span>
                    <span className={styles.detailValue}>
                      <span className={styles.stars}>★★★★★</span> {selectedDoctor.rating} ({selectedDoctor.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Next Available:</span>
                    <span className={styles.detailValue}>{selectedDoctor.nextAvailable}</span>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Success Animation */}
      <div id="booking-success" className={styles.successAnimation}>
        <div className={styles.successContent}>
          <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
            <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <h3>Appointment Booked Successfully!</h3>
        </div>
      </div>
    </div>
  );
}