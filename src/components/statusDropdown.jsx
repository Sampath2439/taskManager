import React, { useState, useRef, useEffect } from 'react';

const StatusDropdown = ({ status, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState('auto');
    const [isDisabled, setIsDisabled] = useState(status === 'Completed');
    const dropdownRef = useRef(null);
    const measureRef = useRef(null);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 sm:text-xl lg:text-sm';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800 sm:text-xl lg:text-sm';
            case 'Pending':
                return 'bg-red-100 text-red-800 sm:text-xl lg:text-sm';
            default:
                return 'bg-gray-100 text-gray-800 sm:text-xl lg:text-sm';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (measureRef.current) {
            setDropdownWidth(measureRef.current.offsetWidth);
        }
    }, [isOpen]);

    const statusOptions = ['Pending', 'In Progress', 'Completed'];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
                className={`${getStatusColor(status)} inline-flex items-center px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isDisabled}
            >
                {status}
                <svg
                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="flex mt-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50" style={{ width: dropdownWidth }}>
                    <ul className="py-0" role="menu">
                        {statusOptions.map((option) => (
                            <li key={option} ref={measureRef} className="hover:bg-gray-100">
                                <button
                                    onClick={() => {
                                        onStatusChange(option);
                                        setIsOpen(false);
                                        if (option === 'Completed') {
                                            setIsDisabled(true);
                                        }
                                    }}
                                    className={`${
                                        status === option ? '' : ''
                                    } text-center block px-4 py-2 sm:text-xl lg:text-sm text-gray-700`}
                                    role="menuitem"
                                >
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;