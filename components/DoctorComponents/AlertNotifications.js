import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaExclamationTriangle, FaCheck, FaTimes, FaHeartbeat } from 'react-icons/fa';
import { useAlertListener } from '@lib/useAlertMonitor';
import { acknowledgeAlert } from '@lib/alertSystem';

export default function AlertNotifications({ doctorId, doctorName }) {
    const { alerts, loading, count, newAlertCount, clearNewAlertCount } = useAlertListener(doctorId, true);
    const [showAlerts, setShowAlerts] = useState(false);
    const [acknowledging, setAcknowledging] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [acknowledgeError, setAcknowledgeError] = useState(null);

    // Play alert sound when new alerts arrive
    useEffect(() => {
        if (newAlertCount > 0 && soundEnabled) {
            // You can add an actual sound file here
            console.log('🔔 New alert sound would play here');

            // Show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('HEALCONNECT Alert', {
                    body: `${newAlertCount} new patient alert(s) require attention`,
                    icon: '/favicon.ico',
                    tag: 'healconnect-alert'
                });
            }
        }
    }, [newAlertCount, soundEnabled]);

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const handleAcknowledge = async (alertId) => {
        setAcknowledging(alertId);
        setAcknowledgeError(null);

        const result = await acknowledgeAlert(alertId, doctorId, doctorName);

        if (result.success) {
            console.log('Alert acknowledged successfully');
        } else {
            setAcknowledgeError('Failed to acknowledge alert. Please try again.');
        }

        setAcknowledging(null);
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            default:
                return 'bg-blue-500';
        }
    };

    const getSeverityIcon = (severity) => {
        return severity === 'critical' ? (
            <FaExclamationTriangle className="text-red-500" size={20} />
        ) : (
            <FaBell className="text-yellow-500" size={20} />
        );
    };

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';

        const now = new Date();
        const alertTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diffMs = now - alertTime;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="relative">
            {/* Alert Bell Button */}
            <motion.button
                onClick={() => {
                    setShowAlerts(!showAlerts);
                    if (!showAlerts) {
                        clearNewAlertCount();
                        setAcknowledgeError(null);
                    }
                }}
                className="relative p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaBell className="text-blue-500 dark:text-blue-400" size={24} />

                {count > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-1 -right-1 ${getSeverityColor(
                            alerts[0]?.severity || 'warning'
                        )} text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center`}
                    >
                        {count > 9 ? '9+' : count}
                    </motion.span>
                )}

                {newAlertCount > 0 && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                    />
                )}
            </motion.button>

            {/* Alert Panel */}
            <AnimatePresence>
                {showAlerts && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FaHeartbeat className="text-red-500" size={20} />
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    Active Alerts ({count})
                                </h3>
                            </div>

                            <button
                                onClick={() => setShowAlerts(false)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <FaTimes className="text-gray-500" size={16} />
                            </button>
                        </div>

                        {/* Inline error message - contextual to alert actions */}
                        {acknowledgeError && (
                            <div
                                className="mx-4 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
                                role="alert"
                            >
                                <FaExclamationTriangle className="flex-shrink-0" size={16} />
                                {acknowledgeError}
                            </div>
                        )}

                        {/* Alert List */}
                        <div className="overflow-y-auto flex-1">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    Loading alerts...
                                </div>
                            ) : count === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <FaCheck className="mx-auto mb-2 text-green-500" size={32} />
                                    <p>No active alerts</p>
                                    <p className="text-sm">All patients are stable</p>
                                </div>
                            ) : (
                                <div className="divide-y dark:divide-gray-700">
                                    {alerts.map((alert) => (
                                        <motion.div
                                            key={alert.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/10' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getSeverityIcon(alert.severity)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                            {alert.patientName}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {getTimeAgo(alert.createdAt)}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                                                        <span className="font-medium">{alert.vitalName}:</span>{' '}
                                                        {alert.currentValue} {alert.unit}
                                                    </p>

                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                        {alert.message}
                                                    </p>

                                                    <button
                                                        onClick={() => handleAcknowledge(alert.id)}
                                                        disabled={acknowledging === alert.id}
                                                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${acknowledging === alert.id
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                                            }`}
                                                    >
                                                        {acknowledging === alert.id ? 'Acknowledging...' : 'Acknowledge'}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {count > 0 && (
                            <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
                                    {soundEnabled ? '🔔 Sound ON' : '🔕 Sound OFF'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
