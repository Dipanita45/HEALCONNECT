import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { FaHistory, FaCheck, FaExclamationTriangle, FaFilter } from 'react-icons/fa';

export default function AlertHistory({ doctorId }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, critical, warning
    const [dateFilter, setDateFilter] = useState('week'); // today, week, month, all

    useEffect(() => {
        fetchAlertHistory();
    }, [doctorId, filter, dateFilter]);

    const fetchAlertHistory = async () => {
        setLoading(true);

        try {
            let q = query(
                collection(db, 'alerts'),
                where('doctorId', '==', doctorId),
                orderBy('createdAt', 'desc')
            );

            // Apply date filter
            if (dateFilter !== 'all') {
                const now = new Date();
                let cutoffDate = new Date();

                switch (dateFilter) {
                    case 'today':
                        cutoffDate.setHours(0, 0, 0, 0);
                        break;
                    case 'week':
                        cutoffDate.setDate(now.getDate() - 7);
                        break;
                    case 'month':
                        cutoffDate.setMonth(now.getMonth() - 1);
                        break;
                }

                q = query(q, where('createdAt', '>=', cutoffDate));
            }

            // Limit results to avoid overwhelming the UI
            q = query(q, limit(50));

            const snapshot = await getDocs(q);
            const alertsList = [];

            snapshot.forEach(doc => {
                const data = { id: doc.id, ...doc.data() };

                // Apply severity filter
                if (filter === 'all' || data.severity === filter) {
                    alertsList.push(data);
                }
            });

            setAlerts(alertsList);
        } catch (error) {
            console.error('Error fetching alert history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSeverityBadge = (severity) => {
        const colors = {
            critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[severity] || ''}`}>
                {severity === 'critical' ? '🚨 Critical' : '⚠️ Warning'}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FaHistory className="text-blue-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Alert History
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <FaFilter className="text-gray-500" size={16} />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-1 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                        <option value="all">All Alerts</option>
                        <option value="critical">Critical Only</option>
                        <option value="warning">Warnings Only</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-3 py-1 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                        <option value="today">Today</option>
                        <option value="week">Past Week</option>
                        <option value="month">Past Month</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* Alert List */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading alert history...</p>
                </div>
            ) : alerts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <FaCheck className="mx-auto mb-4 text-green-500" size={48} />
                    <p className="text-lg font-medium">No alerts found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {alert.patientName}
                                        </h3>
                                        {getSeverityBadge(alert.severity)}
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(alert.createdAt)}
                                    </p>
                                </div>

                                {alert.acknowledged && (
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                                        <FaCheck size={14} />
                                        <span>Acknowledged</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    {alert.vitalName}: {alert.currentValue} {alert.unit}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {alert.message}
                                </p>
                            </div>

                            {alert.acknowledged && alert.acknowledgedByName && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Acknowledged by {alert.acknowledgedByName} at{' '}
                                    {formatDate(alert.acknowledgedAt)}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Summary */}
            {!loading && alerts.length > 0 && (
                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
                        {alerts.length === 50 && ' (limited to 50 most recent)'}
                    </p>
                </div>
            )}
        </div>
    );
}
