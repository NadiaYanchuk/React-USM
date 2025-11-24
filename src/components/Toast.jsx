import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ message, type = 'error', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    const icon = type === 'error' ? faExclamationTriangle : type === 'success' ? faCheckCircle : faInfoCircle;

    return (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[500px]`}>
                <FontAwesomeIcon icon={icon} className="text-2xl" />
                <p className="flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 text-xl font-bold ml-2"
                    aria-label="Закрыть"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;
