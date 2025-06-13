
import React from 'react';

const DateWeatherWidget = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="text-sm text-gray-600">
        <span>{new Date().toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>
      <div className="flex items-center mt-2 sm:mt-0 px-3 py-1 bg-white rounded-lg shadow-sm">
        <div className="w-5 h-5 flex items-center justify-center mr-2">
          <i className="ri-sun-line text-yellow-500"></i>
        </div>
        <span className="text-sm text-gray-600">28°C - São Paulo</span>
      </div>
    </div>
  );
};

export default DateWeatherWidget;
