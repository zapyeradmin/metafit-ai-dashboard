
import React from 'react';

const DailySummary = () => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
            <i className="ri-fire-line text-primary"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Calorias Queimadas</p>
            <p className="text-2xl font-bold text-gray-900">420</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
            <i className="ri-time-line text-primary"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Tempo de Treino</p>
            <p className="text-2xl font-bold text-gray-900">45min</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
            <i className="ri-drop-line text-primary"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Hidratação</p>
            <p className="text-2xl font-bold text-gray-900">2.1L</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
