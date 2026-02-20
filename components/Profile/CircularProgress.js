// components/Profile/CircularProgress.js
import { useMemo } from 'react';
import { getCompletionColor } from '../../lib/profileUtils';

export default function CircularProgress({ percentage = 0, size = 120 }) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const color = useMemo(() => getCompletionColor(percentage), [percentage]);

    return (
        <div className="flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease'
                    }}
                />
            </svg>
            {/* Percentage text */}
            <div className="absolute text-center">
                <div className="text-3xl font-bold" style={{ color }}>
                    {percentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
            </div>
        </div>
    );
}
