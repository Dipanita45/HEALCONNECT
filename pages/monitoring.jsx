import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Monitoring.module.css';
import { isVitalNormal, getVitalStatusMessage, parseBloodPressure } from '../lib/thresholdDefaults';
import { UserContext } from '../lib/context';

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

const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
export default function Monitoring() {
  const { currentUser } = useContext(UserContext);
  const thresholds = currentUser?.thresholds || null;

  const [data, setData] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    oxygen: '',
    glucose: ''
  });

  const [history, setHistory] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentHeartRate, setCurrentHeartRate] = useState(72);
  const [currentOxygen, setCurrentOxygen] = useState(98);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heartRateInterval = useRef(null);
  const oxygenInterval = useRef(null);
 useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await fetch('/api/vitals');
        const json = await res.json();
        if (json.success && json.data) {
          const formatted = json.data.map(v => {
            let bpDisplay = v.bloodPressure;
            if (v.bloodPressure && typeof v.bloodPressure === 'object') {
              bpDisplay = `${v.bloodPressure.systolic}/${v.bloodPressure.diastolic}`;
            }
            
            return {
              date: v.timestamp ? new Date(v.timestamp).toLocaleString() : '',
              temperature: v.temperature || '',
              heartRate: v.heartRate || '',
              bloodPressure: bpDisplay || '',
              oxygen: v.spO2 || v.oxygenSaturation || '',
              glucose: v.glucose || '',
            };
          });
          setHistory(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch vitals:', err);
      }
    };

    fetchVitals();

    return () => {
      if (heartRateInterval.current) clearInterval(heartRateInterval.current);
      if (oxygenInterval.current) clearInterval(oxygenInterval.current);
    };
  }, []);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bp = parseBloodPressure(data.bloodPressure);
      const payload = {
        patientId: 'self',
        deviceId: 'manual-entry',
        heartRate: data.heartRate ? parseInt(data.heartRate) : undefined,
        bloodPressure: bp || undefined,
        temperature: data.temperature ? parseFloat(data.temperature) : undefined,
        spO2: data.oxygen ? parseFloat(data.oxygen) : undefined,
        timestamp: new Date().toISOString(),
      };

      const res = await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        const newRecord = { date: new Date().toLocaleString(), ...data };
        setHistory([newRecord, ...history]);
        setData({ temperature: '', heartRate: '', bloodPressure: '', oxygen: '', glucose: '' });

        const notification = document.getElementById('success-notification');
        notification.style.display = 'block';
        setTimeout(() => { notification.style.display = 'none'; }, 3000);
      }
    } catch (err) {
      console.error('Failed to save vitals:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);

    if (!isMonitoring) {
      // Start simulated monitoring
      heartRateInterval.current = setInterval(() => {
        setCurrentHeartRate(prev => {
          const variation = Math.floor(Math.random() * 5) - 2;
          return Math.max(60, Math.min(100, prev + variation));
        });
      }, 2000);

      oxygenInterval.current = setInterval(() => {
        setCurrentOxygen(prev => {
          const variation = Math.floor(Math.random() * 3) - 1;
          return Math.max(94, Math.min(100, prev + variation));
        });
      }, 3000);
    } else {
      // Stop monitoring
      if (heartRateInterval.current) clearInterval(heartRateInterval.current);
      if (oxygenInterval.current) clearInterval(oxygenInterval.current);
    }
  };

  const getStatusColor = (type, value) => {
    // Use the threshold system for accurate status colors
    const result = isVitalNormal(type, value, thresholds);

    switch (result.severity) {
      case 'critical':
        return '#ef4444'; // Red - critical
      case 'warning':
        return '#f59e0b'; // Yellow/Orange - warning
      case 'none':
        return '#10b981'; // Green - normal
      default:
        return '#3b82f6'; // Blue - default
    }
  };

  const getBloodPressureStatus = (bp) => {
    if (!bp) return { color: '#3b82f6', status: 'Normal' };

    const parsed = parseBloodPressure(bp);
    if (!parsed) return { color: '#3b82f6', status: 'Normal' };

    const systolicResult = isVitalNormal('bloodPressureSystolic', parsed.systolic, thresholds);
    const diastolicResult = isVitalNormal('bloodPressureDiastolic', parsed.diastolic, thresholds);

    if (systolicResult.severity === 'critical' || diastolicResult.severity === 'critical') {
      return { color: '#ef4444', status: 'Critical' };
    }
    if (systolicResult.severity === 'warning' || diastolicResult.severity === 'warning') {
      return { color: '#f59e0b', status: 'Warning' };
    }

    return { color: '#10b981', status: 'Normal' };
  };

  return (
    <div className={styles.container}>
      {/* Navbar spacer */}
      <div className={styles.navbarSpacer}></div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>

      {/* Success Notification */}
      <div id="success-notification" className={styles.successNotification}>
        <div className={styles.notificationContent}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Health data recorded successfully!</span>
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
          Health <span className={styles.titleAccent}>Monitoring</span>
        </h1>
        <p className={styles.subtitle}>
          Track and monitor your vital signs in real-time
        </p>
        <div className={styles.titleUnderline}></div>
      </motion.header>

      <div className={styles.content}>
        <div className={styles.monitoringGrid}>
          {/* Real-time Monitoring Section */}
          <motion.section
            className={styles.liveMonitoring}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
          >
            <div className={styles.sectionHeader}>
              <h2>Live Monitoring</h2>
              <button
                className={`${styles.monitorButton} ${isMonitoring ? styles.monitoringActive : ''}`}
                onClick={toggleMonitoring}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Live Monitoring'}
                <span className={styles.monitorIndicator}></span>
              </button>
            </div>

            <div className={styles.liveDataGrid}>
              <motion.div
                className={styles.liveDataCard}
                variants={pulseAnimation}
                initial="initial"
                animate={isMonitoring ? "animate" : "initial"}
              >
                <div className={styles.liveDataIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12V13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13V12M12 21C11.5 21 11 20.5 11 20V17C11 16.5 11.5 16 12 16C12.5 16 13 16.5 13 17V20C13 20.5 12.5 21 12 21ZM12 21V9M12 9C13.6569 9 15 7.65685 15 6V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V6C9 7.65685 10.3431 9 12 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Heart Rate</h3>
                <div
                  className={styles.liveDataValue}
                  style={{ color: getStatusColor('heartRate', currentHeartRate) }}
                >
                  {isMonitoring ? currentHeartRate : '--'}
                  <span className={styles.unit}>bpm</span>
                </div>
                <div className={styles.liveDataStatus}>
                  {isMonitoring ? (
                    isVitalNormal('heartRate', currentHeartRate, thresholds).status.toUpperCase()
                  ) : 'Not monitoring'}
                </div>
              </motion.div>

              <motion.div
                className={styles.liveDataCard}
                variants={pulseAnimation}
                initial="initial"
                animate={isMonitoring ? "animate" : "initial"}
                transition={{ delay: 0.2 }}
              >
                <div className={styles.liveDataIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8M6 8C3.79086 8 2 9.79086 2 12C2 14.2091 3.79086 16 6 16M6 8C6 8 7 8 8 8C8 6.89543 8.89543 6 10 6H14C15.1046 6 16 6.89543 16 8C17 8 18 8 18 8M18 8C20.2091 8 22 9.79086 22 12C22 14.2091 20.2091 16 18 16M18 16C18 16 17 16 16 16C16 17.1046 15.1046 18 14 18H10C8.89543 18 8 17.1046 8 16C7 16 6 16 6 16M6 16C6 16 6 16 6 16C6 19.3137 8.68629 22 12 22C15.3137 22 18 19.3137 18 16C18 16 18 16 18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Oxygen Saturation</h3>
                <div
                  className={styles.liveDataValue}
                  style={{ color: getStatusColor('oxygen', currentOxygen) }}
                >
                  {isMonitoring ? currentOxygen : '--'}
                  <span className={styles.unit}>%</span>
                </div>
                <div className={styles.liveDataStatus}>
                  {isMonitoring ? (
                    isVitalNormal('oxygen', currentOxygen, thresholds).status.toUpperCase()
                  ) : 'Not monitoring'}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Data Entry Section */}
          <motion.section
            className={styles.dataEntry}
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
          >
            <div className={styles.sectionHeader}>
              <h2>Record Health Data</h2>
              <p>Manually enter your health measurements</p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className={styles.form}
              variants={fadeInUp}
            >
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="temperature"
                    value={data.temperature}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="35"
                    max="42"
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Temperature (°C)</label>
                  <div className={styles.formUnderline}></div>
                  {data.temperature && (
                    <div
                      className={styles.valueStatus}
                      style={{ color: getStatusColor('temperature', parseFloat(data.temperature)) }}
                    >
                      {isVitalNormal('temperature', parseFloat(data.temperature), thresholds).status.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="heartRate"
                    value={data.heartRate}
                    onChange={handleChange}
                    required
                    min="40"
                    max="200"
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Heart Rate (bpm)</label>
                  <div className={styles.formUnderline}></div>
                  {data.heartRate && (
                    <div
                      className={styles.valueStatus}
                      style={{ color: getStatusColor('heartRate', parseFloat(data.heartRate)) }}
                    >
                      {isVitalNormal('heartRate', parseFloat(data.heartRate), thresholds).status.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={data.bloodPressure}
                    onChange={handleChange}
                    required
                    pattern="\d{1,3}\/\d{1,3}"
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Blood Pressure (mmHg)</label>
                  <div className={styles.formUnderline}></div>
                  {data.bloodPressure && (
                    <div
                      className={styles.valueStatus}
                      style={{ color: getBloodPressureStatus(data.bloodPressure).color }}
                    >
                      {getBloodPressureStatus(data.bloodPressure).status}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="oxygen"
                    value={data.oxygen}
                    onChange={handleChange}
                    required
                    min="80"
                    max="100"
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Oxygen Saturation (%)</label>
                  <div className={styles.formUnderline}></div>
                  {data.oxygen && (
                    <div
                      className={styles.valueStatus}
                      style={{ color: getStatusColor('oxygen', parseFloat(data.oxygen)) }}
                    >
                      {isVitalNormal('oxygen', parseFloat(data.oxygen), thresholds).status.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="number"
                    name="glucose"
                    value={data.glucose}
                    onChange={handleChange}
                    required
                    min="50"
                    max="300"
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Glucose Level (mg/dL)</label>
                  <div className={styles.formUnderline}></div>
                  {data.glucose && (
                    <div
                      className={styles.valueStatus}
                      style={{ color: getStatusColor('glucose', parseFloat(data.glucose)) }}
                    >
                      {isVitalNormal('glucose', parseFloat(data.glucose), thresholds).status.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

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
                    Record Measurements
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 12H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 12H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.section>

          {/* History Section */}
          <motion.section
            className={styles.historySection}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            transition={{ delay: 0.2 }}
          >
            <div className={styles.sectionHeader}>
              <h2>Measurement History</h2>
              <p>Your recent health records</p>
            </div>

            <AnimatePresence>
              {history.length > 0 ? (
                <div className={styles.historyList}>
                  {history.map((record, index) => (
                    <motion.div
                      key={index}
                      className={styles.historyCard}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className={styles.historyDate}>{record.date}</div>
                      <div className={styles.historyData}>
                        <div className={styles.historyItem}>
                          <span>Temp:</span>
                          <span style={{ color: getStatusColor('temperature', record.temperature) }}>
                            {record.temperature}°C
                          </span>
                        </div>
                        <div className={styles.historyItem}>
                          <span>Heart Rate:</span>
                          <span style={{ color: getStatusColor('heartRate', record.heartRate) }}>
                            {record.heartRate} bpm
                          </span>
                        </div>
                        <div className={styles.historyItem}>
                          <span>BP:</span>
                          <span style={{ color: getBloodPressureStatus(record.bloodPressure).color }}>
                            {record.bloodPressure}
                          </span>
                        </div>
                        <div className={styles.historyItem}>
                          <span>O₂:</span>
                          <span style={{ color: getStatusColor('oxygen', record.oxygen) }}>
                            {record.oxygen}%
                          </span>
                        </div>
                        {record.glucose && (
                          <div className={styles.historyItem}>
                            <span>Glucose:</span>
                            <span style={{ color: getStatusColor('glucose', record.glucose) }}>
                              {record.glucose} mg/dL
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>No records yet. Start monitoring to see your health data here.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>
      </div>
    </div>
  );
}