// components/Profile/ProfileCompletionWidget.js
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { calculateProfileCompletion, getFieldLabel } from '../../lib/profileUtils';
import CircularProgress from './CircularProgress';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ProfileCompletionWidget({ currentUser, compact = false }) {
    const router = useRouter();

    const completionData = useMemo(() => {
        return calculateProfileCompletion(currentUser);
    }, [currentUser]);

    const { percentage, missingRequired, missingOptional } = completionData;

    const handleCompleteProfile = () => {
        router.push('/patient/edit-profile');
    };

    if (compact) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative" style={{ width: 60, height: 60 }}>
                            <CircularProgress percentage={percentage} size={60} />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Profile Completion
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {missingRequired.length + missingOptional.length} fields remaining
                            </p>
                        </div>
                    </div>
                    {percentage < 100 && (
                        <button
                            onClick={handleCompleteProfile}
                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Complete
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Profile Completion
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {percentage === 100
                        ? "🎉 Your profile is complete!"
                        : "Complete your profile for better healthcare experience"}
                </p>
            </div>

            <div className="flex justify-center mb-6">
                <CircularProgress percentage={percentage} size={140} />
            </div>

            {percentage < 100 && (
                <>
                    {/* Missing Required Fields */}
                    {missingRequired.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
                                <FaExclamationTriangle className="mr-2" />
                                Required Fields
                            </h4>
                            <ul className="space-y-1">
                                {missingRequired.map((field) => (
                                    <li
                                        key={field}
                                        className="text-sm text-gray-700 dark:text-gray-300 flex items-center"
                                    >
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                        {getFieldLabel(field)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Missing Optional Fields */}
                    {missingOptional.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center">
                                <FaExclamationTriangle className="mr-2" />
                                Optional Fields
                            </h4>
                            <ul className="space-y-1">
                                {missingOptional.slice(0, 3).map((field) => (
                                    <li
                                        key={field}
                                        className="text-sm text-gray-700 dark:text-gray-300 flex items-center"
                                    >
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                        {getFieldLabel(field)}
                                    </li>
                                ))}
                                {missingOptional.length > 3 && (
                                    <li className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                        +{missingOptional.length - 3} more fields
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={handleCompleteProfile}
                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                    >
                        Complete My Profile
                    </button>
                </>
            )}

            {percentage === 100 && (
                <div className="text-center text-green-600 dark:text-green-400 flex items-center justify-center">
                    <FaCheckCircle className="mr-2 text-2xl" />
                    <span className="font-semibold">All done!</span>
                </div>
            )}
        </div>
    );
}
