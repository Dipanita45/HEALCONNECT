import AuthCheck from "@components/Auth/AuthCheck";
import AdminSidebar from "@components/Sidebar/AdminSidebar";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@lib/firebase";
import { DEFAULT_THRESHOLDS, initializeDefaultThresholds } from "@lib/thresholdDefaults";
import { FaCog, FaSave, FaUndo, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ThresholdsPage() {
    const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadThresholds();
    }, []);

    const loadThresholds = async () => {
        try {
            const thresholdsRef = doc(db, 'systemConfig', 'thresholds');
            const thresholdsSnap = await getDoc(thresholdsRef);

            if (thresholdsSnap.exists()) {
                const data = thresholdsSnap.data();
                // Remove metadata fields
                const { createdAt, updatedAt, version, ...thresholdData } = data;
                setThresholds(thresholdData);
            } else {
                // Initialize with defaults if not exists
                await initializeDefaultThresholds(db);
                setThresholds(DEFAULT_THRESHOLDS);
            }
        } catch (error) {
            console.error('Error loading thresholds:', error);
            showMessage('Error loading thresholds', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleThresholdChange = (vitalType, field, value) => {
        setThresholds(prev => ({
            ...prev,
            [vitalType]: {
                ...prev[vitalType],
                [field]: parseFloat(value) || 0
            }
        }));
    };

    const saveThresholds = async () => {
        setSaving(true);

        try {
            const thresholdsRef = doc(db, 'systemConfig', 'thresholds');
            await updateDoc(thresholdsRef, {
                ...thresholds,
                updatedAt: Timestamp.now()
            });

            showMessage('Thresholds saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving thresholds:', error);
            showMessage('Failed to save thresholds', 'error');
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = () => {
        if (confirm('Are you sure you want to reset all thresholds to default values?')) {
            setThresholds(DEFAULT_THRESHOLDS);
            showMessage('Thresholds reset to defaults', 'info');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const renderThresholdCard = (vitalType, config) => (
        <div key={vitalType} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {config.vitalType.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {config.description}
            </p>

            <div className="space-y-4">
                {/* Normal Range */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-3">
                        Normal Range
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                Minimum
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={config.minValue}
                                onChange={(e) => handleThresholdChange(vitalType, 'minValue', e.target.value)}
                                className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                Maximum
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={config.maxValue}
                                onChange={(e) => handleThresholdChange(vitalType, 'maxValue', e.target.value)}
                                className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Warning Range */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-3">
                        Warning Range
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                Minimum
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={config.warningMin}
                                onChange={(e) => handleThresholdChange(vitalType, 'warningMin', e.target.value)}
                                className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                Maximum
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={config.warningMax}
                                onChange={(e) => handleThresholdChange(vitalType, 'warningMax', e.target.value)}
                                className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Critical Range */}
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-3">
                        Critical Range
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                Minimum
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={config.criticalMin}
                                onChange={(e) => handleThresholdChange(vitalType, 'criticalMin', e.target.value)}
                                className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-700 dark:text-gray-300 mb-1">
                                Maximum
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={config.criticalMax}
                                onChange={(e) => handleThresholdChange(vitalType, 'criticalMax', e.target.value)}
                                className="w-full px-3 py-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Unit: {config.unit}
                </div>
            </div>
        </div>
    );

    return (
        <AuthCheck>
            <AdminSidebar>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FaCog className="text-blue-500" size={32} />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Alert Thresholds
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Configure vital sign thresholds for patient monitoring
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={resetToDefaults}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <FaUndo size={16} />
                                Reset to Defaults
                            </button>

                            <button
                                onClick={saveThresholds}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                            >
                                <FaSave size={16} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Success/Error Message */}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-800' :
                                    message.type === 'error' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                }`}
                        >
                            <FaCheckCircle />
                            {message.text}
                        </motion.div>
                    )}

                    {/* Threshold Cards */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading thresholds...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(thresholds).map(([vitalType, config]) =>
                                renderThresholdCard(vitalType, config)
                            )}
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            ℹ️ How Thresholds Work
                        </h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                            <li>• <strong>Normal Range:</strong> Values within this range are considered healthy</li>
                            <li>• <strong>Warning Range:</strong> Values outside normal but not critical - generates warning alerts</li>
                            <li>• <strong>Critical Range:</strong> Values outside this range generate critical alerts requiring immediate attention</li>
                            <li>• Changes take effect immediately for all new vital readings</li>
                        </ul>
                    </div>
                </div>
            </AdminSidebar>
        </AuthCheck>
    );
}
