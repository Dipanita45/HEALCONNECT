import { useState } from 'react';
import Button from "@/components/ui/Button";
import styles from './KitSimulation.module.css';

export default function KitSimulation() {
    const [heartRate, setHeartRate] = useState(72);
    const [temperature, setTemperature] = useState(98.6);
    const [oxygen, setOxygen] = useState(98);

    const simulateHeartRate = () => {
        setHeartRate(85);
        setTimeout(() => {
            setHeartRate(72);
        }, 3000);
    };

    const simulateTemperature = () => {
        setTemperature(100.2);
        setTimeout(() => {
            setTemperature(98.6);
        }, 3000);
    };

    const simulateOxygen = () => {
        setOxygen(92);
        setTimeout(() => {
            setOxygen(98);
        }, 3000);
    };

    return (
        <div id="kit" className="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col justify-center py-20">
            <section className="container mx-auto px-4 md:w-1/2 text-center place-content-center">
                <div className="prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm mx-auto mb-12">
                    <h1 className="bg-gradient-to-r from-blue-600 to-blue-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12 rounded-lg text-white font-bold">
                        Our Kit :
                    </h1>
                    <p className="py-2 text-md md:text-2xl text-gray-700 dark:text-gray-300 text-center w-3/4 mx-auto leading-relaxed">
                        This system is established with a health monitoring Kit which enables
                        the doctors to measure{' '}
                        <span className="text-blue-600 dark:text-blue-400 font-display animate-pulse font-bold">
                            body temperature, heart rate and pulse rate
                        </span>{' '}
                        in a single device.
                    </p>
                    <p className="py-2 text-lg md:text-2xl text-gray-700 dark:text-gray-300 w-3/4 mx-auto leading-relaxed">
                        The parameter measured using the kit is shown to appropriate doctor
                        through the website. The{' '}
                        <span className="text-green-600 dark:text-green-400 font-display animate-pulse font-bold">
                            doctor as well as patient
                        </span>{' '}
                        can monitor the information by visiting to the website.
                    </p>
                </div>

                <div className={styles.kitVisualization}>
                    <div className={styles.kitDevice}>
                        <div className={styles.deviceOuter}>
                            <div className={styles.deviceScreen}>
                                <div className={styles.vitalSigns}>
                                    <div className={`${styles.vitalItem} ${styles.animatedHeart}`}>
                                        <span className={styles.vitalIcon}>❤️</span>
                                        <span className={styles.vitalLabel}>Heart Rate</span>
                                        <span className={styles.vitalValue}>{heartRate} <small>bpm</small></span>
                                    </div>
                                    <div className={styles.vitalItem}>
                                        <span className={styles.vitalIcon}>🌡️</span>
                                        <span className={styles.vitalLabel}>Temperature</span>
                                        <span className={styles.vitalValue}>{temperature}°<small>F</small></span>
                                    </div>
                                    <div className={`${styles.vitalItem} ${styles.animatedOxygen}`}>
                                        <span className={styles.vitalIcon}>💨</span>
                                        <span className={styles.vitalLabel}>Oxygen</span>
                                        <span className={styles.vitalValue}>{oxygen}<small>%</small></span>
                                    </div>
                                </div>
                                <div className={styles.connectionStatus}>
                                    <div className={styles.statusIndicator}></div>
                                    <span>Connected</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.deviceBody}>
                            <div className={styles.powerButton}></div>
                        </div>
                    </div>

                    <div className={styles.dataTransmission}>
                        <div className={styles.transmissionWave}></div>
                        <div className={styles.transmissionWave}></div>
                        <div className={styles.transmissionWave}></div>
                    </div>

                    <div className={styles.receivingDevices}>
                        <div className={styles.doctorDevice}>
                            <div className={styles.deviceScreen}>
                                <div className={styles.patientData}>
                                    <div className={styles.patientInfo}>
                                        <div className={styles.patientAvatar}></div>
                                        <div className={styles.patientName}>John Doe</div>
                                    </div>
                                    {/* healthchart */}
                                    <div className={styles.healthChart}>
                                        <div className={styles.chartLine}></div>
                                        <div className={styles.chartLine}></div>
                                        <div className={styles.chartLine}></div>
                                    </div>
                                    <div className={styles.healthStats}>
                                        <div className={styles.stat}>
                                            <span>HR</span>
                                            <span className={styles.statValue}>{heartRate}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span>Temp</span>
                                            <span className={styles.statValue}>{temperature}°</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span>O2</span>
                                            <span className={styles.statValue}>{oxygen}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mobileDevice}>
                            <div className={styles.mobileScreen}>
                                <div className={styles.appInterface}>
                                    <div className={styles.appHeader}>Health Status</div>
                                    <div className={styles.appStats}>
                                        <div className={styles.metric}>
                                            <div className={styles.metricValue}>{heartRate}</div>
                                            <div className={styles.metricLabel}>BPM</div>
                                        </div>
                                        <div className={styles.metric}>
                                            <div className={styles.metricValue}>{temperature}°</div>
                                            <div className={styles.metricLabel}>Temp</div>
                                        </div>
                                        <div className={styles.metric}>
                                            <div className={styles.metricValue}>{oxygen}%</div>
                                            <div className={styles.metricLabel}>O2 Sat</div>
                                        </div>
                                    </div>
                                    <div className={styles.trendIndicator}>
                                        <span className={styles.trendUp}>↑</span>
                                        <span>Stable</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                        Try Our Virtual Demo
                    </h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button variant="outline" onClick={simulateHeartRate}>
                            Simulate Heart Rate
                        </Button>
                        <Button variant="outline" onClick={simulateTemperature}>
                            Simulate Temperature
                        </Button>
                        <Button variant="outline" onClick={simulateOxygen}>
                            Simulate Oxygen Levels
                        </Button>
                    </div>

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                        <p>
                            Note: This is a simulation. Actual device requires physical contact
                            for accurate readings.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}