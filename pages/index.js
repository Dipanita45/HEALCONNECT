import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "./footer";
import Image from 'next/image';
import styles from './index.module.css';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Set initial visibility
    setIsVisible(true);

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.show);
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });
    
    const hiddenElements = document.querySelectorAll(`.${styles.animation}`);
    hiddenElements.forEach((el) => observer.observe(el));

    // Service Worker registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
        .catch((err) =>
          console.error("❌ Service Worker registration failed:", err)
        );
    }

    // Offline banner toggle
    const updateOnlineStatus = () => {
      const banner = document.getElementById("offline-banner");
      if (!navigator.onLine) {
        banner.style.display = "block";
      } else {
        banner.style.display = "none";
      }
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    // Cleanup
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Doctor data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Specialized in heart disease prevention and treatment with a focus on remote patient monitoring."
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      experience: "9 years",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Expert in neurological disorders and an advocate for technology in healthcare management."
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Dedicated to children's health and early diagnosis through continuous health monitoring."
    }
  ];

  // Interactive simulation functions for the demo
const simulateHeartRate = () => {
  const heartValue = document.querySelector(`.${styles.animatedHeart} .${styles.vitalValue}`);
  if (heartValue) {
    heartValue.textContent = "85 bpm";
    setTimeout(() => {
      heartValue.textContent = "72 bpm";
    }, 3000);
  }
};

const simulateTemperature = () => {
  const tempValue = document.querySelectorAll(`.${styles.vitalItem} .${styles.vitalValue}`)[1];
  if (tempValue) {
    tempValue.textContent = "100.2°F";
    setTimeout(() => {
      tempValue.textContent = "98.6°F";
    }, 3000);
  }
};

const simulateOxygen = () => {
  const oxygenValue = document.querySelector(`.${styles.animatedOxygen} .${styles.vitalValue}`);
  if (oxygenValue) {
    oxygenValue.textContent = "92%";
    setTimeout(() => {
      oxygenValue.textContent = "98%";
    }, 3000);
  }
};

  return (
    <div className={styles.container}>
      <Head>
        <title>HEALCONNECT - Modern Healthcare Platform</title>
        <meta name="description" content="HEALCONNECT - Bridging healthcare and technology to deliver smarter, faster, and secure patient solutions." />
      </Head>
      
      <main className={styles.main}>
        {/* Offline Banner */}
        <div
          id="offline-banner"
          className={styles.offlineBanner}
          style={{ display: "none" }}
        >
          ⚠️ You are offline – showing last cached data.
        </div>

        {/* Floating Navigation */}
        <div className={styles.floatingNav}>
          <button 
            className={`${styles.navDot} ${activeSection === 'hero' ? styles.activeDot : ''}`}
            onClick={() => scrollToSection('hero')}
            aria-label="Scroll to Hero section"
          ></button>
          <button 
            className={`${styles.navDot} ${activeSection === 'problem' ? styles.activeDot : ''}`}
            onClick={() => scrollToSection('problem')}
            aria-label="Scroll to Problem section"
          ></button>
          <button 
            className={`${styles.navDot} ${activeSection === 'solution' ? styles.activeDot : ''}`}
            onClick={() => scrollToSection('solution')}
            aria-label="Scroll to Solution section"
          ></button>
          <button 
            className={`${styles.navDot} ${activeSection === 'doctors' ? styles.activeDot : ''}`}
            onClick={() => scrollToSection('doctors')}
            aria-label="Scroll to Doctors section"
          ></button>
          <button 
            className={`${styles.navDot} ${activeSection === 'kit' ? styles.activeDot : ''}`}
            onClick={() => scrollToSection('kit')}
            aria-label="Scroll to Kit section"
          ></button>
        </div>

        {/* Hero Section */}
        <section id="hero" className={`${styles.hero} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.heroBackground}>
            <div className={styles.circleAnimation}></div>
            <div className={styles.circleAnimation}></div>
            <div className={styles.circleAnimation}></div>
          </div>
          
          <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  HealConnect <span className={styles.gradientText}>System</span>
                </h1>
                <p className={styles.heroDescription}>
                  This system is a <span className={styles.highlightYellow}>virtual</span> platform to{' '}
                  <span className={styles.highlightPink}>monitor</span> health anytime and anywhere.
                </p>
                <div className={styles.heroButtons}>
                  <button className={styles.ctaButton} onClick={() => scrollToSection('problem')}>
                    Explore Features
                  </button>
                  <button className={styles.secondaryButton} onClick={() => scrollToSection('doctors')}>
                    Meet Our Doctors
                  </button>
                </div>
              </div>
              <div className={styles.heroImage}>
                <div className={styles.imageContainer}>
                  <Image
                    src="/dashboard.svg"
                    alt="Healthcare dashboard illustration"
                    width={600}
                    height={400}
                    priority
                    className={styles.dashboardImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
              </div>
            </div>
            
            <div className={styles.scrollIndicator}>
              <div className={styles.scrollText}>Discover More</div>
              <div className={styles.scrollArrow} onClick={() => scrollToSection('problem')}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </section>

{/* Problem Section */}
<div id="problem" className={styles.sectionWrapper}>
  <section className={`${styles.problemSection} ${styles.animation}`}>
    <div className={styles.sectionBackground}></div>
    <div className={styles.sectionContainer}>
      <h2 className={styles.sectionBadge}>
        The Healthcare Challenge
      </h2>
      
      <div className={styles.problemVisualization}>
        <div className={styles.problemIllustration}>
          <div className={styles.patientSilhouette}>
            <div className={styles.silhouetteBody}>
              <div className={styles.vitalMonitor}>
                <div className={styles.monitorScreen}>
                  <div className={styles.heartbeatLine}></div>
                </div>
              </div>
              <div className={styles.problemPoints}>
                <div className={`${styles.problemPoint} ${styles.point1}`}>
                  <div className={styles.pointPulse}></div>
                  <span>Delayed Data</span>
                </div>
                <div className={`${styles.problemPoint} ${styles.point2}`}>
                  <div className={styles.pointPulse}></div>
                  <span>No History</span>
                </div>
                <div className={`${styles.problemPoint} ${styles.point3}`}>
                  <div className={styles.pointPulse}></div>
                  <span>Limited Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.problemContent}>
          <div className={styles.contentCard}>
            <div className={styles.problemItem}>
              <div className={styles.problemIcon}>⏱️</div>
              <div className={styles.problemText}>
                <h3>Time-Critical Decisions</h3>
                <p>
                  Getting <span className={styles.highlightOrange}>real-time health parameters</span>{' '}
                  immediately is crucial for timely treatment and better outcomes.
                </p>
              </div>
            </div>
            
            <div className={styles.problemItem}>
              <div className={styles.problemIcon}>📋</div>
              <div className={styles.problemText}>
                <h3>Incomplete Patient History</h3>
                <p>
                  Without access to comprehensive{' '}
                  <span className={styles.highlightBlue}>patient history</span>, doctors struggle to{' '}
                  make fully informed treatment decisions.
                </p>
              </div>
            </div>
            
            <div className={styles.problemItem}>
              <div className={styles.problemIcon}>🔍</div>
              <div className={styles.problemText}>
                <h3>Data Fragmentation</h3>
                <p>
                  Critical health information is often scattered across different systems,{' '}
                  leading to inefficiencies and potential oversights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.thoughtBubble} onClick={() => scrollToSection('solution')}>
        <span>How can we solve these challenges?</span>
        <div className={styles.bubbleArrow}></div>
      </div>
    </div>
  </section>
</div>

{/* Solution Section */}
<div id="solution" className={styles.sectionWrapper}>
  <section className={`${styles.solutionSection} ${styles.animation}`}>
    <div className={styles.sectionBackground}></div>
    <div className={styles.sectionContainer}>
      <h2 className={`${styles.sectionBadge} ${styles.solutionBadge}`}>
        Our Innovative Solution
      </h2>
      
      <div className={styles.solutionIntro}>
        <div className={styles.contentCard}>
          <p className={styles.sectionText}>
            HEALCONNECT bridges these gaps by providing a comprehensive platform that enables{' '}
            <span className={styles.highlightYellow}>real-time health monitoring</span> and{' '}
            <span className={styles.highlightOrange}>secure data access anytime, anywhere</span>.
          </p>
        </div>
      </div>
      
      <div className={styles.solutionVisualization}>
        <div className={styles.dataFlowAnimation}>
          <div className={styles.patientNode}>
            <div className={styles.nodeIcon}>👤</div>
            <div className={styles.nodeLabel}>Patient</div>
          </div>
          
          <div className={styles.connectionPath}>
            <div className={styles.dataStream}></div>
            <div className={styles.dataParticle}></div>
            <div className={styles.dataParticle}></div>
            <div className={styles.dataParticle}></div>
          </div>
          
          <div className={styles.platformNode}>
            <div className={styles.nodeIcon}>🌐</div>
            <div className={styles.nodeLabel}>HEALCONNECT</div>
          </div>
          
          <div className={styles.connectionPath}>
            <div className={styles.dataStream}></div>
            <div className={styles.dataParticle}></div>
            <div className={styles.dataParticle}></div>
            <div className={styles.dataParticle}></div>
          </div>
          
          <div className={styles.doctorNode}>
            <div className={styles.nodeIcon}>👨‍⚕️</div>
            <div className={styles.nodeLabel}>Doctor</div>
          </div>
        </div>
      </div>
      
      <div className={styles.featureShowcase}>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureGlow}></div>
            </div>
            <h3 style={{ color: '#111184' }} >Real-time Monitoring</h3>
            <p>Continuous tracking of health parameters with instant alerts</p>
            <div className={styles.featureHighlight}></div>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>🔒</div>
              <div className={styles.featureGlow}></div>
            </div>
            <h3 style={{ color: '#111184' }}>Secure Data</h3>
            <p>End-to-end encryption with blockchain-based security</p>
            <div className={styles.featureHighlight}></div>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>🌐</div>
              <div className={styles.featureGlow}></div>
            </div>
            <h3 style={{ color: '#111184' }}>Remote Access</h3>
            <p>Access patient data from any device, anywhere in the world</p>
            <div className={styles.featureHighlight}></div>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>📈</div>
              <div className={styles.featureGlow}></div>
            </div>
            <h3 style={{ color: '#111184' }}>Historical Analysis</h3>
            <p>Comprehensive patient history with trend analysis</p>
            <div className={styles.featureHighlight}></div>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>🤖</div>
              <div className={styles.featureGlow}></div>
            </div>
            <h3 style={{ color: '#111184' }}>AI Insights</h3>
            <p>Predictive analytics and early warning systems</p>
            <div className={styles.featureHighlight}></div>
          </div>
          
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <div className={styles.featureIcon}>📱</div>
              <div className={styles.featureGlow}></div>
            </div>
            <h3 style={{ color: '#111184' }}>Mobile Integration</h3>
            <p>Seamless connectivity with mobile health devices</p>
            <div className={styles.featureHighlight}></div>
          </div>
        </div>
      </div>
      
      <div className={styles.benefitsSection}>
        <h3 style={{ color: '#111184' }}>Key Benefits</h3>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitProgress}></div>
            <h4>60% Faster</h4>
            <p>Reduction in emergency response time</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitProgress}></div>
            <h4>45% Improvement</h4>
            <p>In treatment decision accuracy</p>
          </div>
          
          <div className={styles.benefitCard}>
            <div className={styles.benefitProgress}></div>
            <h4>24/7</h4>
            <p>Continuous monitoring and support</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

        {/* Doctors Section */}
        <div id="doctors" className={styles.sectionWrapper}>
          <section className={`${styles.doctorsSection} ${styles.animation}`}>
            <div className={styles.sectionBackground}></div>
            <div className={styles.sectionContainer}>
              <h2 className={`${styles.sectionBadge} ${styles.doctorsBadge}`}>
                Our Medical Experts
              </h2>
              <p className={styles.sectionSubtitle}>
                Meet our team of dedicated healthcare professionals using HEALCONNECT to provide better care.
              </p>
              
              <div className={styles.doctorsGrid}>
                {doctors.map((doctor) => (
                  <div key={doctor.id} className={styles.doctorCard}>
                    <div className={styles.doctorImageContainer}>
                      <Image
                        src={doctor.image}
                        alt={doctor.name}
                        width={200}
                        height={200}
                        className={styles.doctorImage}
                      />
                      <div className={styles.doctorOverlay}></div>
                    </div>
                    <div className={styles.doctorInfo}>
                      <h3 className={styles.doctorName}>{doctor.name}</h3>
                      <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                      <p className={styles.doctorExperience}>{doctor.experience} of experience</p>
                      <p className={styles.doctorDescription}>{doctor.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

<div id="kit" className={styles.sectionWrapper}>
  <section className={`${styles.kitSection} ${styles.animation}`}>
    <div className={styles.sectionBackground}></div>
    <div className={styles.sectionContainer}>
      <h2 className={`${styles.sectionBadge} ${styles.kitBadge}`}>
        Our Smart Monitoring Kit
      </h2>
      
      <div className={styles.kitContent}>
        <div className={styles.kitDescription}>
          <div className={styles.contentCard}>
            <p className={styles.sectionText}>
              Our advanced health monitoring kit enables doctors to measure{' '}
              <span className={styles.highlightBlue}>body temperature, heart rate, oxygen levels, and pulse rate</span>{' '}
              with medical-grade precision in a single, intuitive device.
            </p>
            <p className={styles.sectionText}>
              All parameters are transmitted securely to both doctors and patients through our platform, enabling{' '}
              <span className={styles.highlightGreen}>real-time monitoring and immediate response</span>{' '}
              to any concerning health trends.
            </p>
          </div>
          
          <div className={styles.kitFeatures}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <div className={styles.featureText}>Syncs with mobile app</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔋</div>
              <div className={styles.featureText}>72-hour battery life</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌐</div>
              <div className={styles.featureText}>Cloud connectivity</div>
            </div>
          </div>
        </div>
        
        <div className={styles.kitVisualization}>
          <div className={styles.kitDevice}>
            <div className={styles.deviceOuter}>
              <div className={styles.deviceScreen}>
                <div className={styles.vitalSigns}>
                  <div className={`${styles.vitalItem} ${styles.animatedHeart}`}>
                    <span className={styles.vitalIcon}>❤️</span>
                    <span className={styles.vitalLabel}>Heart Rate</span>
                    <span className={styles.vitalValue}>72 <small>bpm</small></span>
                  </div>
                  <div className={styles.vitalItem}>
                    <span className={styles.vitalIcon}>🌡️</span>
                    <span className={styles.vitalLabel}>Temperature</span>
                    <span className={styles.vitalValue}>98.6°<small>F</small></span>
                  </div>
                  <div className={`${styles.vitalItem} ${styles.animatedOxygen}`}>
                    <span className={styles.vitalIcon}>💨</span>
                    <span className={styles.vitalLabel}>Oxygen</span>
                    <span className={styles.vitalValue}>98<small>%</small></span>
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
                  <div className={styles.healthChart}>
                    <div className={styles.chartLine}></div>
                    <div className={styles.chartLine}></div>
                    <div className={styles.chartLine}></div>
                  </div>
                  <div className={styles.healthStats}>
                    <div className={styles.stat}>
                      <span>HR</span>
                      <span className={styles.statValue}>72</span>
                    </div>
                    <div className={styles.stat}>
                      <span>Temp</span>
                      <span className={styles.statValue}>98.6°</span>
                    </div>
                    <div className={styles.stat}>
                      <span>O2</span>
                      <span className={styles.statValue}>98%</span>
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
                      <div className={styles.metricValue}>72</div>
                      <div className={styles.metricLabel}>BPM</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>98.6°</div>
                      <div className={styles.metricLabel}>Temp</div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricValue}>98%</div>
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
      </div>
      
      <div className={styles.kitInteractive}>
        <h3>Try Our Virtual Demo</h3>
        <div className={styles.demoControls}>
          <button className={styles.demoButton} onClick={simulateHeartRate}>
            Simulate Heart Rate
          </button>
          <button className={styles.demoButton} onClick={simulateTemperature}>
            Simulate Temperature
          </button>
          <button className={styles.demoButton} onClick={simulateOxygen}>
            Simulate Oxygen Levels
          </button>
        </div>
        <div className={styles.demoNote}>
          <p>Note: This is a simulation. Actual device requires physical contact for accurate readings.</p>
        </div>
      </div>
    </div>
  </section>
</div>
        {/* Footer Section */}
        <Footer />
      </main>
    </div>
  );
}