import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import Image from 'next/image';
import styles from './Appointments.module.css';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerChildren = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const formItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ============================================================================
// CONSTANTS & DATA
// ============================================================================
const AVAILABLE_TIMES = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", 
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
];

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
      wednesday: [{ start: "09:00", end: "12:00" }],
      thursday: [{ start: "13:00", end: "17:00" }],
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
      monday: [{ start: "10:00", end: "14:00" }],
      tuesday: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "16:00" }
      ],
      wednesday: [],
      thursday: [{ start: "09:00", end: "12:00" }],
      friday: [{ start: "13:00", end: "17:00" }]
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
      tuesday: [{ start: "10:00", end: "14:00" }],
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
      tuesday: [{ start: "09:00", end: "12:00" }],
      wednesday: [{ start: "13:00", end: "17:00" }],
      thursday: [
        { start: "09:00", end: "12:00" },
        { start: "13:00", end: "16:00" }
      ],
      friday: [{ start: "10:00", end: "14:00" }]
    } 
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const getDayFromDate = (date) => {
  return new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
};

const timeToMinutes = (timeString) => {
  const [value, period] = timeString.split(" ");
  let [hours, minutes] = value.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + (minutes || 0);
};

const filterTimesByAvailability = (times, doctor, date) => {
  if (!doctor || !date) return times;

  const day = getDayFromDate(date);
  const windows = doctor.availability?.[day];

  if (!windows || windows.length === 0) return [];

  return times.filter((time) => {
    const timeInMinutes = timeToMinutes(time);

    return windows.some(({ start, end }) => {
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);

      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;

      return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
    });
  });
};

// Form validation helper
const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!formData.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.date = 'Date cannot be in the past';
    }
  }
  
  if (!formData.time) {
    errors.time = 'Time is required';
  }
  
  if (!formData.reason.trim()) {
    errors.reason = 'Reason for visit is required';
  } else if (formData.reason.trim().length < 5) {
    errors.reason = 'Please provide more details (at least 5 characters)';
  }
  
  return errors;
};

// Get minimum selectable date (today)
const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function Appointments() {
  // State management
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    doctor: '',
    reason: ''
  });

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        signInAnonymously(auth).catch((error) => {
          console.error('Authentication error:', error);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch booked slots when date or doctor changes
  useEffect(() => {
    if (formData.date && formData.doctor) {
      fetchBookedSlots(formData.date, formData.doctor);
    }
  }, [formData.date, formData.doctor]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const fetchBookedSlots = useCallback(async (date, doctorId) => {
    setIsLoadingSlots(true);
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("date", "==", date),
        where("doctorId", "==", doctorId)
      );
      
      const querySnapshot = await getDocs(q);
      const times = querySnapshot.docs.map(doc => doc.data().time);
      setBookedTimes(times);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to load available time slots. Please try again.'
      });
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  const handleDoctorSelect = useCallback((doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      doctor: doctor.id.toString()
    }));
    setStep(2);
    setFormErrors({});
    setSubmitMessage({ type: '', text: '' });
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleBackToDoctors = useCallback(() => {
    setStep(1);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      date: '',
      time: '',
      doctor: '',
      reason: ''
    });
    setFormErrors({});
    setSubmitMessage({ type: '', text: '' });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [formErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitMessage({
        type: 'error',
        text: 'Please fix the errors above'
      });
      return;
    }

    if (!user) {
      setSubmitMessage({
        type: 'error',
        text: 'Authentication required. Please refresh the page.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        doctorId: formData.doctor,
        doctorName: selectedDoctor.name,
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Show success animation
      const successElement = document.getElementById('booking-success');
      if (successElement) {
        successElement.style.display = 'flex';
        setTimeout(() => {
          successElement.style.display = 'none';
        }, 3000);
      }

      setSubmitMessage({
        type: 'success',
        text: '✓ Appointment booked successfully! You will receive a confirmation email shortly.'
      });

      // Reset form after delay
      setTimeout(() => {
        handleBackToDoctors();
      }, 3000);

    } catch (error) {
      console.error("Error booking appointment:", error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to book appointment. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================
  
  const minDate = useMemo(() => getMinDate(), []);

  const availableTimes = useMemo(() => {
    const filtered = filterTimesByAvailability(
      AVAILABLE_TIMES,
      selectedDoctor,
      formData.date
    );
    return filtered;
  }, [selectedDoctor, formData.date]);

  const availableDoctors = useMemo(() => {
    return doctors.filter(doctor => doctor.available);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>

      <div className={styles.navbarSpacer}></div>

      {/* Header */}
      <motion.header 
        className={styles.header}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className={styles.titleContainer}>
          <span className={styles.titlePrefix}>Healthcare Booking</span>
          <span className={styles.titleMain}>Schedule Your Visit</span>
          <span className={styles.titleSuffix}>Easy & Fast</span>
        </div>
      </motion.header>

      <main className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <DoctorSelection 
              doctors={doctors}
              availableDoctors={availableDoctors}
              onSelect={handleDoctorSelect}
            />
          )}
          
          {step === 2 && selectedDoctor && (
            <BookingForm
              selectedDoctor={selectedDoctor}
              formData={formData}
              formErrors={formErrors}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onBack={handleBackToDoctors}
              minDate={minDate}
              availableTimes={availableTimes}
              bookedTimes={bookedTimes}
              isSubmitting={isSubmitting}
              submitMessage={submitMessage}
              isLoadingSlots={isLoadingSlots}
            />
          )}
        </AnimatePresence>
      </main>

      <SuccessAnimation />
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function DoctorSelection({ doctors, availableDoctors, onSelect }) {
  return (
    <motion.section
      className={styles.doctorsSection}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={scaleIn}
    >
      <h2 className={styles.sectionTitle}>Choose Your Doctor</h2>
      <p className={styles.sectionSubtitle}>
        Select from our team of experienced healthcare professionals
      </p>

      <motion.div 
        className={styles.doctorsGrid}
        variants={staggerChildren}
      >
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.id} 
            doctor={doctor} 
            onSelect={onSelect}
          />
        ))}
      </motion.div>

      {availableDoctors.length === 0 && (
        <div className={styles.noAvailability}>
          <p>No doctors available at this time. Please check back later.</p>
        </div>
      )}
    </motion.section>
  );
}

function DoctorCard({ doctor, onSelect }) {
  return (
    <motion.div
      className={styles.doctorCard}
      onClick={() => onSelect(doctor)}
      variants={formItemVariants}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(doctor);
        }
      }}
      aria-label={`Select ${doctor.name}, ${doctor.specialty}`}
    >
      <div className={styles.doctorImage}>
        <Image
          src={doctor.image}
          alt={`${doctor.name} - ${doctor.specialty}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          priority={doctor.id <= 2}
        />
        <div className={`${styles.availability} ${doctor.available ? styles.available : styles.unavailable}`}>
          {doctor.available ? '● Available' : '● Busy'}
        </div>
      </div>

      <div className={styles.doctorInfo}>
        <h3>{doctor.name}</h3>
        <p className={styles.specialty}>{doctor.specialty}</p>

        <div className={styles.rating}>
          <span className={styles.stars} aria-label={`Rating: ${doctor.rating} out of 5`}>
            {'★'.repeat(Math.floor(doctor.rating))}
            {doctor.rating % 1 !== 0 && '☆'}
          </span>
          <span className={styles.ratingText}>
            {doctor.rating} ({doctor.reviews} reviews)
          </span>
        </div>

        <p className={styles.experience}>Experience: {doctor.experience}</p>
        <p className={styles.nextAvailable}>
          {doctor.available ? `Next: ${doctor.nextAvailable}` : 'Not available today'}
        </p>
      </div>

      <button 
        className={styles.selectButton}
        disabled={!doctor.available}
        aria-label={`Book appointment with ${doctor.name}`}
      >
        {doctor.available ? 'Book Appointment' : 'Not Available'}
      </button>
    </motion.div>
  );
}

function BookingForm({
  selectedDoctor,
  formData,
  formErrors,
  onChange,
  onSubmit,
  onBack,
  minDate,
  availableTimes,
  bookedTimes,
  isSubmitting,
  submitMessage,
  isLoadingSlots
}) {
  return (
    <motion.section
      id="booking-form"
      className={styles.bookingSection}
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={scaleIn}
    >
      <div className={styles.bookingHeader}>
        <motion.button 
          onClick={onBack} 
          className={styles.backButton}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to doctor selection"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Doctors
        </motion.button>
        <h2 className={styles.sectionTitle}>Book with {selectedDoctor.name}</h2>
        <p className={styles.selectedDoctorSpecialty}>{selectedDoctor.specialty}</p>
      </div>

      <div className={styles.bookingContent}>
        <motion.form 
          onSubmit={onSubmit} 
          className={styles.form}
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          noValidate
        >
          {/* Submit Message */}
          <AnimatePresence>
            {submitMessage.text && (
              <motion.div 
                className={`${styles.submitMessage} ${
                  submitMessage.type === 'success' 
                    ? styles.submitMessageSuccess 
                    : styles.submitMessageError
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                role="alert"
                aria-live="polite"
              >
                {submitMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className={styles.formRow}
            variants={formItemVariants}
          >
            <FormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              label="Patient Full Name"
              error={formErrors.name}
              required
              autoComplete="name"
            />
            
            <FormInput
              type="date"
              name="date"
              value={formData.date}
              onChange={onChange}
              label="Appointment Date"
              error={formErrors.date}
              min={minDate}
              required
            />
          </motion.div>
          
          <motion.div 
            className={styles.formRow}
            variants={formItemVariants}
          >
            <FormSelect
              name="time"
              value={formData.time}
              onChange={onChange}
              label="Preferred Time"
              error={formErrors.time}
              disabled={isLoadingSlots || !formData.date}
              required
            >
              <option value="">Select Time</option>
              {isLoadingSlots && (
                <option disabled>Loading available times...</option>
              )}
              {!isLoadingSlots && availableTimes.length === 0 && formData.date && (
                <option disabled>No available times for this date</option>
              )}
              {availableTimes.map(time => (
                <option
                  key={time}
                  value={time}
                  disabled={bookedTimes.includes(time)}
                >
                  {time} {bookedTimes.includes(time) ? "(Booked)" : ""}
                </option>
              ))}
            </FormSelect>
            
            <FormInput
              type="text"
              name="reason"
              value={formData.reason}
              onChange={onChange}
              label="Reason for Visit"
              error={formErrors.reason}
              required
              placeholder=" "
            />
          </motion.div>
          
          <DoctorSummary doctor={selectedDoctor} />
          
          <motion.button 
            type="submit" 
            className={styles.submitButton}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            disabled={isSubmitting || !selectedDoctor.available}
            variants={formItemVariants}
            aria-label="Confirm appointment booking"
          >
            {isSubmitting ? (
              <>
                <div className={styles.spinner} aria-hidden="true"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                Confirm Appointment
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </motion.button>
        </motion.form>
        
        <DoctorDetails doctor={selectedDoctor} />
      </div>
    </motion.section>
  );
}

function FormInput({ type, name, value, onChange, label, error, ...props }) {
  return (
    <div className={styles.inputGroup}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.formInput} ${error ? styles.error : ''}`}
        placeholder=" "
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      <label className={styles.formLabel}>{label}</label>
      <div className={styles.formUnderline}></div>
      {error && (
        <span 
          id={`${name}-error`}
          className={styles.errorText} 
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}

function FormSelect({ name, value, onChange, label, error, required, children, ...props }) {
  const hasValue = value && value !== '';
  
  return (
    <div className={styles.inputGroup}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`${styles.formInput} ${styles.formSelect} ${error ? styles.error : ''} ${hasValue ? styles.hasValue : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      <label className={styles.formLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.formUnderline}></div>
      {error && (
        <span 
          id={`${name}-error`}
          className={styles.errorText} 
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}

function DoctorSummary({ doctor }) {
  return (
    <motion.div 
      className={styles.selectedDoctorSummary}
      variants={formItemVariants}
    >
      <div className={styles.summaryImage}>
        <Image 
          src={doctor.image} 
          alt={doctor.name}
          width={120} 
          height={120}
          className={styles.image}
        />
      </div>
      <div className={styles.summaryInfo}>
        <h4>{doctor.name}</h4>
        <p>{doctor.specialty}</p>
        <div className={styles.availability}>
          Status: <span className={doctor.available ? styles.availableText : styles.unavailableText}>
            {doctor.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function DoctorDetails({ doctor }) {
  return (
    <motion.div 
      className={styles.doctorDetails}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
    >
      <h3>About Dr. {doctor.name.split(' ')[1]}</h3>
      <p className={styles.doctorBio}>
        {doctor.name} is a renowned {doctor.specialty.toLowerCase()} with over {doctor.experience} of experience. 
        Specializing in patient-centered care, Dr. {doctor.name.split(' ')[1]} has helped thousands of patients 
        achieve better health outcomes.
      </p>
      
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Specialty:</span>
        <span className={styles.detailValue}>{doctor.specialty}</span>
      </div>
      
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Experience:</span>
        <span className={styles.detailValue}>{doctor.experience}</span>
      </div>
      
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Rating:</span>
        <span className={styles.detailValue}>
          <span className={styles.stars} aria-label={`${doctor.rating} stars`}>★★★★★</span> 
          {doctor.rating} ({doctor.reviews} reviews)
        </span>
      </div>
      
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Next Available:</span>
        <span className={styles.detailValue}>{doctor.nextAvailable}</span>
      </div>
    </motion.div>
  );
}

function SuccessAnimation() {
  return (
    <div id="booking-success" className={styles.successAnimation} role="dialog" aria-live="assertive">
      <div className={styles.successContent}>
        <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" aria-hidden="true">
          <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
          <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h3>Appointment Booked Successfully!</h3>
        <p>You will receive a confirmation email shortly.</p>
      </div>
    </div>
  );
}