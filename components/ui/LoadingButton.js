import React from 'react';
import styles from './LoadingButton.module.css';

const LoadingButton = ({
    children,
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    className = '',
    style = {},
    variant = 'primary', // primary, secondary, danger
    ...props
}) => {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const getVariantStyles = () => {
        if (variant === 'danger') {
            return {
                background: loading || disabled ? '#7f1d1d' : '#dc2626',
                color: 'white',
            };
        }
        if (variant === 'secondary') {
            return {
                background: loading || disabled ? '#4a5568' : '#718096',
                color: 'white',
            };
        }
        // Default primary
        return {
            background: loading || disabled ? '#718096' : (isDark ? '#1565c0' : '#1976d2'),
            color: 'white',
        };
    };

    const baseStyle = {
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        opacity: loading ? 0.8 : (disabled ? 0.6 : 1),
        width: '100%',
        ...getVariantStyles(),
        ...style,
    };

    return (
        <button
            type={type}
            disabled={loading || disabled}
            onClick={onClick}
            style={baseStyle}
            className={`${className}`}
            {...props}
        >
            {loading && (
                <svg
                    className={styles.spinner}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '18px', height: '18px' }}
                >
                    <circle
                        style={{ opacity: 0.25 }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        style={{ opacity: 0.75 }}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            <span>{children}</span>
        </button>
    );
};

export default LoadingButton;
