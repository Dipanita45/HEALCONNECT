import styles from './Problem.module.css';

export default function Problem({ scrollToSection }) {
  // SVG background logic extracted to keep JSX clean
  const bgImage = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%233b82f6' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  return (
    <div id="problem" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-gray-900">
      <section className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center gap-8 lg:gap-10 min-h-[60vh]">
        <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
          style={{ backgroundImage: bgImage }} >
        </div>

        <div className="flex-1 flex justify-center w-full lg:order-first">
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
                  <span className="text-slate-700 dark:text-slate-100 font-semibold text-xs sm:text-sm">Delayed Data</span>
                </div>
                <div className={`${styles.problemPoint} ${styles.point2}`}>
                  <div className={styles.pointPulse}></div>
                  <span className="text-slate-700 dark:text-slate-100 font-semibold text-xs sm:text-sm">No History</span>
                </div>
                <div className={`${styles.problemPoint} ${styles.point3}`}>
                  <div className={styles.pointPulse}></div>
                  <span className="text-slate-700 dark:text-slate-100 font-semibold text-xs sm:text-sm">Limited Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <span className="inline-block bg-gradient-to-br from-blue-500 to-emerald-500 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            The Healthcare Challenge
          </span>

          <div className="bg-cyan-50/30 text-slate-800 dark:bg-gray-800 dark:text-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-blue-500/5 dark:shadow-blue-500/10 mb-8 sm:mb-10 w-full max-w-2xl border border-cyan-200/50 dark:border-gray-700">

            <div className="flex gap-4 mb-6 p-5 rounded-xl bg-transparent border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
              <div className="text-xl sm:text-2xl">⏱️</div>
              <div>
                <h3 className=" text-lg sm:text-xl font-medium text-slate-800 dark:text-gray-200 mb-2">Time-Critical Decisions</h3>
                <p className="text-slate-500 dark:text-gray-400 leading-relaxed">
                  Getting <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-1 rounded">real-time health parameters</span>{' '}
                  immediately is crucial for timely treatment and better outcomes.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-6 p-5 rounded-xl bg-transparent border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
              <div className="text-2xl">📋</div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-gray-200 mb-2">Incomplete Patient History</h3>
                <p className="text-slate-500 dark:text-gray-400 leading-relaxed">
                  Without access to comprehensive{' '}
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded">patient history</span>, doctors struggle to{' '}
                  make fully informed treatment decisions.
                </p>
              </div>
            </div>
            {/* // new clasese added here */}

            <div className="flex gap-4 mb-6 p-5 rounded-xl bg-transparent border border-slate-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg hover:-translate-y-1">
              <div className="text-2xl">🔍</div>
              <div>
                <h3 className="text-xl font-medium text-slate-800 dark:text-gray-200 mb-2">Data Fragmentation</h3>
                <p className="text-slate-500 dark:text-gray-400 leading-relaxed">
                  Critical health information is often scattered across different systems,{' '}
                  leading to inefficiencies and potential oversights.
                </p>
              </div>
            </div>
          </div>

          <div 
            className={`${styles.thoughtBubble} bg-white dark:bg-gray-800`} 
            onClick={() => scrollToSection('solution')}
          >
            <span className="font-medium text-slate-700 dark:text-gray-300">How can we solve these challenges?</span>
          </div>
        </div>
      </section>
    </div>
  );
}