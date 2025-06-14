
import React from 'react';
import { useMetabolicCalculations } from '@/hooks/useMetabolicCalculations';

const MetabolicStats = () => {
  const { metabolicData } = useMetabolicCalculations();

  const stats = [
    {
      label: 'Taxa Metabólica Basal',
      value: `${metabolicData.bmr} kcal`,
      icon: 'ri-heart-pulse-line',
      color: 'text-red-500 bg-red-50'
    },
    {
      label: 'Valor Energético Total',
      value: `${metabolicData.tev} kcal`,
      icon: 'ri-flashlight-line',
      color: 'text-orange-500 bg-orange-50'
    },
    {
      label: 'Gasto Calórico Diário por Treino',
      value: `${metabolicData.dailyWorkoutCalories} kcal`,
      icon: 'ri-fire-line',
      color: 'text-yellow-500 bg-yellow-50'
    },
    {
      label: 'Gasto Calórico Total',
      value: `${metabolicData.totalCaloriesBurned} kcal`,
      icon: 'ri-dashboard-line',
      color: 'text-green-500 bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${stat.color}`}>
              <i className={`${stat.icon} text-lg`}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetabolicStats;
