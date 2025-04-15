import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatisticsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeDirection = 'up',
  color = 'blue',
  valueSize = 'text-3xl'
}) => {
  // Color configurations
  const colorConfigs = {
    blue: {
      bgLight: 'bg-blue-50',
      bgIcon: 'bg-blue-100',
      textIcon: 'text-blue-600',
      textValue: 'text-blue-700'
    },
    red: {
      bgLight: 'bg-red-50',
      bgIcon: 'bg-red-100',
      textIcon: 'text-red-600',
      textValue: 'text-red-700'
    },
    green: {
      bgLight: 'bg-green-50',
      bgIcon: 'bg-green-100',
      textIcon: 'text-green-600',
      textValue: 'text-green-700'
    },
    purple: {
      bgLight: 'bg-purple-50',
      bgIcon: 'bg-purple-100',
      textIcon: 'text-purple-600',
      textValue: 'text-purple-700'
    },
    yellow: {
      bgLight: 'bg-yellow-50',
      bgIcon: 'bg-yellow-100',
      textIcon: 'text-yellow-600',
      textValue: 'text-yellow-700'
    },
    gray: {
      bgLight: 'bg-gray-50',
      bgIcon: 'bg-gray-100',
      textIcon: 'text-gray-600',
      textValue: 'text-gray-700'
    }
  };
  
  const currentColor = colorConfigs[color];
  
  return (
    <div className={`${currentColor.bgLight} p-6 rounded-lg shadow-sm`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-full ${currentColor.bgIcon}`}>
          <div className={currentColor.textIcon}>
            {icon}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className={`${valueSize} font-bold ${currentColor.textValue}`}>
          {value}
        </span>
        
        {change !== undefined && (
          <div className="flex items-center mt-1">
            {changeDirection === 'up' ? (
              <ArrowUp size={16} className="text-green-500" />
            ) : (
              <ArrowDown size={16} className="text-red-500" />
            )}
            <span className={`text-sm ml-1 ${
              changeDirection === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400 ml-1">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;