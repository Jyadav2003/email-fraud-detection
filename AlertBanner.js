// src/components/common/AlertBanner.js
import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const AlertBanner = ({ 
  message, 
  type = 'info', 
  onClose,
  className = '' 
}) => {
  const alertTypes = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      styling: 'bg-green-50 text-green-800 border-green-200'
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5" />,
      styling: 'bg-yellow-50 text-yellow-800 border-yellow-200'
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      styling: 'bg-red-50 text-red-800 border-red-200'
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      styling: 'bg-blue-50 text-blue-800 border-blue-200'
    }
  };

  const { icon, styling } = alertTypes[type] || alertTypes.info;

  return (
    <div className={`rounded-md border p-4 ${styling} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;