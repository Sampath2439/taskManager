import React from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: 'text-green-500',
          bgColor: 'bg-green-100',
          darkBgColor: 'dark:bg-green-800',
          darkTextColor: 'dark:text-green-200',
          icon: (
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
          )
        };
      case 'error':
        return {
          iconColor: 'text-red-500',
          bgColor: 'bg-red-100',
          darkBgColor: 'dark:bg-red-800',
          darkTextColor: 'dark:text-red-200',
          icon: (
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
            </svg>
          )
        };
      case 'warning':
        return {
          iconColor: 'text-orange-500',
          bgColor: 'bg-orange-100',
          darkBgColor: 'dark:bg-orange-700',
          darkTextColor: 'dark:text-orange-200',
          icon: (
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
            </svg>
          )
        };
      default:
        return getToastConfig('success');
    }
  };

  const config = getToastConfig();

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50">
      <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${config.iconColor} ${config.bgColor} rounded-lg ${config.darkBgColor} ${config.darkTextColor}`}>
          {config.icon}
          <span className="sr-only">{type} icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Toast;