import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "./footer";
import Image from 'next/image';
import styles from './index.module.css';
import Button from "@/components/ui/Button"
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
                <div className="flex gap-4">
  <Button variant="primary" onClick={() => scrollToSection('problem')}>
    Explore Features
  </Button>
  <Button variant="secondary" onClick={() => scrollToSection('doctors')}>
    Meet Our Doctors
  </Button>
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
        <div className="h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900">
          <section className="animation container md:w-1/2 text-center place-content-center prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm">
            <h1 className="animation bg-gradient-to-r from-yellow-600 to-yellow-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12">
              Solution
            </h1>
            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
              This system will let the organization meet their requirement of
              measuring patient
              <span className="text-yellow-600 font-display animate-pulse">
                health parameters
              </span>{" "}
              and make this data available and accessible to doctors remotely
              <span className="text-orange-600 font-display animate-pulse">
                anytime anywhere
              </span>
              .
            </p>
            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
              This system will let the organization manage their
              <span className="text-blue-500 font-display animate-pulse">
                doctors and patients
              </span>{" "}
              data and maintains security end to end.
            </p>
            <a
              className="animate-bounce no-underline block mt-12 md:text-xl text-base"
              href=""
            >
              How you get monitored? 🧐
            </a>
          </section>
        </div>

        {/* Kit Section */}
        <div className="h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900">
          <section className="animation container md:w-1/2 text-center place-content-center prose dark:prose-invert md:prose-lg lg:prose-lg sm:prose-sm">
            <h1 className="animation bg-gradient-to-r from-blue-600 to-blue-300 inline-block px-6 py-3 text-lg md:text-2xl shadow-lg mb-12">
              Our Kit :
            </h1>
            <p className="animation py-2 text-md:text-2xl text-gray5 dark:text-gray3 text-center w-3/4 mx-auto">
              This system is established with a health monitoring Kit which enables
              the doctors to measure
              <span className="text-blue-600 font-display animate-pulse">
                body temperature, heart rate and pulse rate
              </span>{" "}
              in a single device.
            </p>
            <p className="animation py-2 text-lg md:text-2xl text-gray5 dark:text-gray3 w-3/4 mx-auto">
              The parameter measured using the kit is shown to appropriate doctor
              through the website. The
              <span className="text-green-600 font-display animate-pulse">
                doctor as well as patient
              </span>{" "}
              can monitor the information by visiting to the website.
            </p>
            <a
              className="animate-bounce no-underline block mt-12 md:text-xl text-base"
              href=""
            >
              How you get monitored? 🧐
            </a>
          </section>
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
      
      
            <div className={styles.kitInteractive}>
        <h3>Try Our Virtual Demo</h3>
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

        <div className={styles.demoNote}>
          <p>
            Note: This is a simulation. Actual device requires physical contact
            for accurate readings.
          </p>
        </div>
      </div>

  {/* Footer Section */}
  < Footer />
</main>
</div>
);
}
