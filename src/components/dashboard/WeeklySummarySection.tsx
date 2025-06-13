
import React from 'react';
import { WeeklyChart } from '../WeeklyChart';

const WeeklySummarySection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Resumo Semanal</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">Esta Semana</button>
          <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">Mês</button>
        </div>
      </div>
      <div className="h-72">
        <WeeklyChart />
      </div>
    </div>
  );
};

export default WeeklySummarySection;
