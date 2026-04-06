'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import styles from './Prescriptions.module.css'
import { FaPlus, FaHeadset, FaArrowUp, FaEdit, FaCheck, FaTrash, FaFileAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const schema = Joi.object({
  medicine: Joi.string().min(3).required().messages({
    'string.empty': 'Medicine name is required',
    'string.min': 'Medicine name must be at least 3 characters'
  }),
  dosage: Joi.string().required().messages({
    'string.empty': 'Dosage is required'
  }),
  frequency: Joi.string().not('').required().messages({
    'any.only': 'Please select a frequency',
    'any.required': 'Frequency is required'
  }),
  duration: Joi.number().positive().required().messages({
    'number.base': 'Duration must be a number',
    'number.positive': 'Duration must be a positive number'
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'Please enter a valid date'
  }),
  notes: Joi.string().allow('')
})

export default function Prescriptions() {
  const { theme } = useTheme()
  const [prescriptions, setPrescriptions] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [summaryById, setSummaryById] = useState({})
  const [loadingSummaryId, setLoadingSummaryId] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      medicine: '',
      dosage: '',
      frequency: '',
      duration: '',
      startDate: '',
      notes: ''
    }
  })

  useEffect(() => {
    // Initial data
    setPrescriptions([
      { id: 1, medicine: 'Amoxicillin', dosage: '500mg', frequency: 'Every 8 hours', duration: '7', startDate: '2023-10-10', endDate: '2023-10-17', status: 'active', notes: 'Take with food' },
      { id: 2, medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30', startDate: '2023-10-01', endDate: '2023-10-31', status: 'active', notes: 'Take in the morning' }
    ])
  }, [])

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return ''
    const date = new Date(startDate)
    date.setDate(date.getDate() + parseInt(duration))
    return date.toISOString().split('T')[0]
  }

  const onSubmit = (data) => {
    setIsSubmitting(true)
    setTimeout(() => {
      const endDate = calculateEndDate(data.startDate, data.duration)
      if (editingId) {
        setPrescriptions(prev => prev.map(p => p.id === editingId ? { ...p, ...data, endDate } : p))
        setEditingId(null)
        toast.success('Prescription Updated!')
      } else {
        const newP = { id: Date.now(), ...data, endDate, status: 'active' }
        setPrescriptions([newP, ...prescriptions])
        toast.success('Prescription Added!')
      }
      reset()
      setIsSubmitting(false)
    }, 800)
  }

  const handleEdit = (p) => {
    setEditingId(p.id)
    setValue('medicine', p.medicine)
    setValue('dosage', p.dosage)
    setValue('frequency', p.frequency)
    setValue('duration', p.duration)
    setValue('startDate', p.startDate)
    setValue('notes', p.notes || '')

    // Smooth scroll to form on mobile
    if (window.innerWidth < 1024) {
      document.querySelector(`.${styles.formSection}`)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDelete = (id) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id))
    toast.error('Prescription Deleted')
  }

  const handleMarkCompleted = (id) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: 'completed' } : p))
    toast.success('Marked as Completed')
  }

  const handleGenerateSummary = async (p) => {
    setLoadingSummaryId(p.id)
    // Simulate API call
    setTimeout(() => {
      setSummaryById(prev => ({ ...prev, [p.id]: `Take ${p.medicine} (${p.dosage}) ${p.frequency} for ${p.duration} days.` }))
      setLoadingSummaryId(null)
      toast('Summary Generated', { icon: '📝' })
    }, 1500)
  }

  const filteredPrescriptions = prescriptions.filter(p => {
    if (activeTab === 'current') return p.status === 'active'
    if (activeTab === 'completed') return p.status === 'completed'
    return true
  })

  return (
    <div className={styles.container}>
      <div className={styles.navbarSpacer}></div>
      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.prescriptionsGrid}>
          {/* LEFT: LIST SECTION */}
          <motion.section
            className={styles.listSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.sectionHeader}>
              <h2>Prescriptions</h2>
              <div className={styles.tabs}>
                {['all', 'current', 'completed'].map(tab => (
                  <button
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.prescriptionsList}>
              <AnimatePresence mode="popLayout">
                {filteredPrescriptions.length > 0 ? (
                  filteredPrescriptions.map(p => (
                    <motion.div
                      key={p.id}
                      className={styles.prescriptionCard}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className={styles.prescriptionHeader}>
                        <h3 className={styles.medicineName}>{p.medicine}</h3>
                        <div className={styles.prescriptionActions}>
                          {p.status === 'active' && (
                            <>
                              <button className={styles.actionButton} onClick={() => handleEdit(p)} title="Edit"><FaEdit /></button>
                              <button className={styles.actionButton} onClick={() => handleMarkCompleted(p.id)} title="Complete"><FaCheck /></button>
                            </>
                          )}
                          <button className={styles.actionButton} onClick={() => handleGenerateSummary(p)} disabled={loadingSummaryId === p.id} title="Summary">
                            {loadingSummaryId === p.id ? '...' : <FaFileAlt />}
                          </button>
                          <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => handleDelete(p.id)} title="Delete"><FaTrash /></button>
                        </div>
                      </div>

                      <div className={styles.prescriptionDetails}>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Dosage</span><span className={styles.detailValue}>{p.dosage}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Frequency</span><span className={styles.detailValue}>{p.frequency}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Duration</span><span className={styles.detailValue}>{p.duration} days</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>End Date</span><span className={styles.detailValue}>{p.endDate}</span></div>
                      </div>

                      {summaryById[p.id] && (
                        <motion.div
                          className="mt-4 p-4 bg-blue-500/10 rounded-xl text-sm border border-blue-500/20 text-blue-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          {summaryById[p.id]}
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <FaFileAlt />
                    <p>Your prescriptions will appear here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* RIGHT: FORM SECTION */}
          <motion.section
            className={styles.formSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>{editingId ? 'Edit Dosage' : 'Add New Rx'}</h2>
              {editingId && (
                <button className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest" onClick={() => { setEditingId(null); reset(); }}>Cancel</button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputGroup}>
                <input {...register('medicine')} className={styles.formInput} placeholder=" " />
                <label className={styles.formLabel}>Medicine Name <span className={styles.blueDot}>*</span></label>
                <div className={styles.formUnderline}></div>
                <AnimatePresence>
                  {errors.medicine && (
                    <motion.p
                      className={styles.errorText}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {errors.medicine.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.inputGroup}>
                <input {...register('dosage')} className={styles.formInput} placeholder=" " />
                <label className={styles.formLabel}>Dosage <span className={styles.blueDot}>*</span></label>
                <div className={styles.formUnderline}></div>
                <AnimatePresence>
                  {errors.dosage && (
                    <motion.p
                      className={styles.errorText}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {errors.dosage.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className={`${styles.inputGroup} ${styles.selectGroup}`}>
                <select {...register('frequency')} className={styles.formSelect}>
                  <option value="" disabled>Select Frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every 8 hours">Every 8 hours</option>
                  <option value="As needed">As needed</option>
                </select>
                <label className={`${styles.formLabel} ${styles.selectLabel}`}>Frequency <span className={styles.blueDot}>*</span></label>
                <div className={styles.formUnderline}></div>
                <AnimatePresence>
                  {errors.frequency && (
                    <motion.p className={styles.errorText} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      {errors.frequency.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.inputGroup}>
                <input {...register('duration')} className={styles.formInput} placeholder=" " />
                <label className={styles.formLabel}>Duration (days) <span className={styles.blueDot}>*</span></label>
                <div className={styles.formUnderline}></div>
                <AnimatePresence>
                  {errors.duration && (
                    <motion.p className={styles.errorText} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      {errors.duration.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.inputGroup}>
                <input {...register('startDate')} type="date" className={styles.formInput} placeholder=" " />
                <label className={styles.formLabel}>Start Date <span className={styles.blueDot}>*</span></label>
                <div className={styles.formUnderline}></div>
                <AnimatePresence>
                  {errors.startDate && (
                    <motion.p className={styles.errorText} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      {errors.startDate.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.inputGroup}>
                <textarea {...register('notes')} className={styles.formTextarea} placeholder=" " rows={2} />
                <label className={styles.formLabel}>Notes</label>
                <div className={styles.formUnderline}></div>
              </div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : (editingId ? 'Save Changes' : 'Confirm Prescription')}
              </motion.button>
            </form>
          </motion.section>
        </div>
      </div>

      <div className={styles.statusBadge}><div className={styles.statusDot}></div>Online</div>
    </div>
  )
}
