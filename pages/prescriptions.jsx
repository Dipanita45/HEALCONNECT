'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Prescriptions.module.css'

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

export default function Prescriptions() {
  const [formData, setFormData] = useState({
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    startDate: '',
    notes: ''
  });

  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { theme } = useTheme();

  // Sample initial prescriptions
  useEffect(() => {
    setPrescriptions([
      {
        id: 1,
        medicine: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        startDate: '2023-10-10',
        endDate: '2023-10-17',
        notes: 'Take with food',
        status: 'active',
        reminders: ['08:00', '16:00', '00:00']
      },
      {
        id: 2,
        medicine: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
        notes: 'Take in the morning',
        status: 'active',
        reminders: ['08:00']
      },
      {
        id: 3,
        medicine: 'Metformin',
        dosage: '850mg',
        frequency: 'Twice daily',
        duration: '30 days',
        startDate: '2023-09-15',
        endDate: '2023-10-15',
        notes: 'Take with meals',
        status: 'completed',
        reminders: ['09:00', '21:00']
      }
    ]);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const generateReminders = frequency => {
    switch (frequency) {
      case 'Once daily':
        return ['08:00']
      case 'Twice daily':
        return ['08:00', '20:00']
      case 'Three times daily':
        return ['08:00', '14:00', '20:00']
      case 'Every 6 hours':
        return ['06:00', '12:00', '18:00', '00:00']
      case 'Every 8 hours':
        return ['08:00', '16:00', '00:00']
      case 'Every 12 hours':
        return ['08:00', '20:00']
      default:
        return ['08:00']
    }
  }

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return ''
    const days = parseInt(duration)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + days)
    return endDate.toISOString().split('T')[0]
  }

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (editingId) {
        setPrescriptions(prev =>
          prev.map(p =>
            p.id === editingId
              ? {
                ...p,
                ...formData,
                duration: formData.duration,
                endDate: calculateEndDate(formData.startDate, formData.duration),
                reminders: generateReminders(formData.frequency),
                status: 'active'
              }
              : p
          )
        )
        setEditingId(null)
      } else {
        const newPrescription = {
          id: Date.now(),
          ...formData,
          status: 'active',
          reminders: generateReminders(formData.frequency),
          endDate: calculateEndDate(formData.startDate, formData.duration)
        };
        setPrescriptions([newPrescription, ...prescriptions]);
      }

      setFormData({
        medicine: '',
        dosage: '',
        frequency: '',
        duration: '',
        startDate: '',
        notes: ''
      })

      setIsSubmitting(false)

      const notification = document.getElementById('success-notification')
      if (notification) {
        notification.style.display = 'block'
        setTimeout(() => {
          notification.style.display = 'none'
        }, 3000)
      }
    }, 1500)
  }

  const handleEdit = prescription => {
    setFormData({
      medicine: prescription.medicine,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      startDate: prescription.startDate,
      notes: prescription.notes || ''
    });
    setEditingId(prescription.id);
  };

  const handleDelete = id => {
    setPrescriptions(prev => prev.filter(p => p.id !== id))
  }

  const handleMarkCompleted = id => {
    setPrescriptions(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'completed' } : p))
    )
  }

  const filteredPrescriptions = prescriptions.filter(p => {
    if (activeTab === 'current') return p.status === 'active'
    if (activeTab === 'completed') return p.status === 'completed'
    return true
  })

  return (
    <div
      className={`${styles.container} ${theme === 'dark' ? styles.dark : ''
        }`}
    >
      <div className={styles.navbarSpacer}></div>

      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>

      <div id="success-notification" className={styles.successNotification}>
        <div className={styles.notificationContent}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{editingId ? 'Prescription updated!' : 'Prescription added!'}</span>
        </div>
      </div>

      <motion.header
        className={styles.header}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className={styles.title}>
          Medication <span className={styles.titleAccent}>Management</span>
        </h1>
        <p className={styles.subtitle}>
          Manage your prescriptions and medication schedule
        </p>
        <div className={styles.titleUnderline}></div>
      </motion.header>

      <div className={styles.content}>
        <div className={styles.prescriptionsGrid}>
          {/* Your Prescriptions – FIRST (also on mobile) */}
          <motion.section
            className={styles.listSection}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
          >
            <div className={styles.sectionHeader}>
              <h2>Your Prescriptions</h2>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''
                    }`}
                  onClick={() => setActiveTab('all')}
                >
                  All
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'current' ? styles.activeTab : ''
                    }`}
                  onClick={() => setActiveTab('current')}
                >
                  Current
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''
                    }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            <AnimatePresence>
              {filteredPrescriptions.length > 0 ? (
                <div className={styles.prescriptionsList}>
                  {filteredPrescriptions.map(prescription => (
                    <motion.div
                      key={prescription.id}
                      className={`${styles.prescriptionCard} ${prescription.status === 'completed'
                        ? styles.completed
                        : ''
                        }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.prescriptionHeader}>
                        <h3 className={styles.medicineName}>
                          {prescription.medicine}
                          {prescription.status === 'completed' && (
                            <span className={styles.completedBadge}>
                              Completed
                            </span>
                          )}
                        </h3>
                        <div className={styles.prescriptionActions}>
                          {prescription.status === 'active' && (
                            <>
                              <button
                                className={styles.actionButton}
                                onClick={() => handleEdit(prescription)}
                                title="Edit"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              <button
                                className={styles.actionButton}
                                onClick={() =>
                                  handleMarkCompleted(prescription.id)
                                }
                                title="Mark as completed"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                          <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(prescription.id)}
                            title="Delete"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className={styles.prescriptionDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Dosage:</span>
                          <span className={styles.detailValue}>
                            {prescription.dosage}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Frequency:</span>
                          <span className={styles.detailValue}>
                            {prescription.frequency}
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Duration:</span>
                          <span className={styles.detailValue}>
                            {prescription.duration} days
                          </span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Period:</span>
                          <span className={styles.detailValue}>
                            {prescription.startDate} to {prescription.endDate}
                          </span>
                        </div>
                        {prescription.notes && (
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Notes:</span>
                            <span className={styles.detailValue}>
                              {prescription.notes}
                            </span>
                          </div>
                        )}
                      </div>

                      {prescription.status === 'active' &&
                        prescription.reminders && (
                          <div className={styles.remindersSection}>
                            <h4>Reminder Times:</h4>
                            <div className={styles.remindersList}>
                              {prescription.reminders.map((time, index) => (
                                <span
                                  key={index}
                                  className={styles.reminderTime}
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className={styles.emptyState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 8L18.1327 20.1425C18.0579 21.1891 17.187 22 16.1378 22H7.86224C6.81296 22 5.94208 21.1891 5.86732 20.1425L5 8M10 12V18M14 12V18M15 8V5C15 4.44772 14.5523 4 14 4H10C9.44772 4 9 4.44772 9 5V8M4 8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>No prescriptions found. Add your first prescription to get started.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Add New Prescription – SECOND (visible on mobile) */}
          <motion.section
            className={styles.formSection}
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
          >
            <div className={styles.sectionHeader}>
              <h2>{editingId ? 'Edit Prescription' : 'Add New Prescription'}</h2>
              {editingId && (
                <button
                  className={styles.cancelEdit}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      medicine: '',
                      dosage: '',
                      frequency: '',
                      duration: '',
                      startDate: '',
                      notes: ''
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className={styles.form}
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
            >
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="medicine"
                    value={formData.medicine}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Medicine Name *</label>
                  <div className={styles.formUnderline}></div>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Dosage *</label>
                  <div className={styles.formUnderline}></div>
                </div>

                <div className={styles.inputGroup}>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  >
                    <option value="">Select Frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Every 12 hours">Every 12 hours</option>
                    <option value="As needed">As needed</option>
                  </select>
                  <label className={styles.formLabel}>Frequency *</label>
                  <div className={styles.formUnderline}></div>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Duration (days) *</label>
                  <div className={styles.formUnderline}></div>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Start Date *</label>
                  <div className={styles.formUnderline}></div>
                </div>

                {formData.startDate && formData.duration && (
                  <div className={styles.datePreview}>
                    <span>
                      End Date:{' '}
                      {calculateEndDate(formData.startDate, formData.duration)}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={styles.formTextarea}
                  placeholder=" "
                  rows={3}
                />
                <label className={styles.formLabel}>Additional Notes</label>
                <div className={styles.formUnderline}></div>
              </div>

              {formData.frequency && (
                <div className={styles.reminderPreview}>
                  <h4>Reminder Times:</h4>
                  <div className={styles.reminderTimes}>
                    {generateReminders(formData.frequency).map(
                      (time, index) => (
                        <span key={index} className={styles.reminderBadge}>
                          {time}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <>
                    {editingId ? 'Update Prescription' : 'Add Prescription'}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.section>
        </div>
      </div>
    </div>
  );
}