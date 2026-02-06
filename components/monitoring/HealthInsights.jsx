import { motion } from 'framer-motion';
import { FaBrain, FaRegLightbulb, FaExclamationTriangle, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import { isVitalNormal, DEFAULT_THRESHOLDS } from '../../lib/thresholdDefaults';

export default function HealthInsights({ currentVitals, history }) {
  // AI analysis logic using standardized thresholds
  const analyzeHealth = () => {
    const insights = [];
    const { heartRate, oxygen } = currentVitals;

    // Heart Rate Analysis using centralized thresholds
    if (heartRate > 0) {
      const hrStatus = isVitalNormal('heartRate', heartRate);
      if (hrStatus.status === 'critical' || hrStatus.status === 'warning') {
        const isHigh = heartRate > DEFAULT_THRESHOLDS.heartRate.maxValue;
        insights.push({
          id: 'hr-alert',
          type: hrStatus.status,
          title: `${isHigh ? 'Elevated' : 'Low'} Heart Rate Detected`,
          message: isHigh 
            ? 'Your heart rate is currently above the resting average. This could be due to stress, caffeine, or recent physical activity.'
            : 'Your heart rate is lower than the standard resting average.',
          recommendation: isHigh 
            ? 'Try some deep breathing exercises for 5 minutes and re-measure.'
            : 'If you feel dizzy or unusually fatigued, please consult a professional.',
          icon: <FaExclamationTriangle className={isHigh ? "text-amber-500" : "text-blue-500"} />
        });
      }
    }

    // Oxygen Analysis using centralized thresholds
    if (oxygen > 0) {
      const oxStatus = isVitalNormal('oxygen', oxygen);
      if (oxStatus.status === 'critical' || oxStatus.status === 'warning') {
        insights.push({
          id: 'spo2-low',
          type: oxStatus.status,
          title: 'Oxygen Saturation Alert',
          message: `Your SpO2 levels (${oxygen}%) are below the optimal range.`,
          recommendation: 'Ensure you are in a well-ventilated area. If this persists or you feel short of breath, contact a healthcare provider.',
          icon: <FaExclamationTriangle className="text-red-500" />
        });
      }
    }

    // Trend Analysis (using history)
    if (history && history.length > 2) {
        const hrTrend = history[0].heartRate > history[1].heartRate && history[1].heartRate > history[2].heartRate;
        if (hrTrend) {
            insights.push({
                id: 'trend-hr-up',
                type: 'info',
                title: 'Rising Heart Rate Trend',
                message: 'We’ve noticed a slight upward trend in your resting heart rate over the last 3 measurements.',
                recommendation: 'Make sure you are getting enough sleep and staying hydrated.',
                icon: <FaChartLine className="text-indigo-500" />
            });
        }
    }

    // Positive Insights
    if (insights.length === 0 && heartRate > 0) {
      insights.push({
        id: 'all-good',
        type: 'success',
        title: 'Vitals are Stable',
        message: 'Your current health parameters are within the healthy range. Great job maintaining your wellness!',
        recommendation: 'Keep up your current routine and stay hydrated.',
        icon: <FaCheckCircle className="text-emerald-500" />
      });
    }

    return insights;
  };

  const insights = analyzeHealth();

  // Generate a daily summary message based on data
  const generateSummary = () => {
    if (!history || history.length === 0) return "Start monitoring to generate your daily health summary.";
    
    const normalCount = history.filter(h => {
        const hr = isVitalNormal('heartRate', h.heartRate);
        const ox = isVitalNormal('oxygen', h.oxygen);
        return hr.severity === 'none' && ox.severity === 'none';
    }).length;

    const percentage = Math.round((normalCount / history.length) * 100);
    
    if (percentage === 100) return "Your health parameters have been exceptionally stable today. All recorded vitals are within optimal ranges.";
    if (percentage > 80) return "You've had a mostly healthy day. A few minor fluctuations were detected, but overall your vitals are stable.";
    return "We've noticed several fluctuations in your health data today. It might be a good idea to rest and monitor closely.";
  };

  return (
    <div className="mt-12">
      {/* Daily Summary Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-200 dark:border-blue-800/30"
      >
        <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-600">
                <FaRegLightbulb className="text-xl" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Daily Health Summary</h3>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                    "{generateSummary()}"
                </p>
            </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
          <FaBrain className="text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold dark:text-white">AI Health Insights</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time analysis of your physiological data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="hc-card p-6 border-l-4"
            style={{ 
              borderLeftColor: insight.type === 'critical' ? '#ef4444' : 
                               insight.type === 'warning' ? '#f59e0b' : 
                               insight.type === 'success' ? '#10b981' : '#3b82f6' 
            }}
          >
            <div className="flex gap-4">
              <div className="text-2xl mt-1">{insight.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 dark:text-white">{insight.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {insight.message}
                </p>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Recommendation</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic font-medium">
                    "{insight.recommendation}"
                  </p>
                </div>
                {insight.type === 'critical' && (
                  <Link 
                    href="/appointments" 
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Book a priority consultation →
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
