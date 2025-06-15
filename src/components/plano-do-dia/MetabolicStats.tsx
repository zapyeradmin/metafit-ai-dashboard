
import React from 'react';
import { useMetabolicCalculations } from '@/hooks/useMetabolicCalculations';

const toDisplayNumber = (value: any, decimals = 0) => {
  const num = Number(value);
  if (isNaN(num)) return '-';
  return decimals > 0 ? num.toFixed(decimals) : Math.round(num);
};

const MetabolicStats = () => {
  const { metabolicData } = useMetabolicCalculations();

  // Garantir que todos os valores para contas sejam número ou '-' para display seguro.
  const bmr = Number(metabolicData.bmr);
  const tev = Number(metabolicData.tev);
  const dailyWorkoutCalories = Number(metabolicData.dailyWorkoutCalories);
  const totalCaloriesBurned = Number(metabolicData.totalCaloriesBurned);
  const bmi = Number(metabolicData.bmi);
  const idealWeight = Number(metabolicData.idealWeight);
  const bodyFatPercentage = Number(metabolicData.bodyFatPercentage);
  const leanBodyMass = Number(metabolicData.leanBodyMass);

  const stats = [
    {
      label: 'Taxa Metabólica Basal',
      value: isNaN(bmr) ? '-' : `${toDisplayNumber(bmr)} kcal`,
      icon: 'ri-heart-pulse-line',
      color: 'text-red-500 bg-red-50',
      description: 'Energia mínima para funções vitais'
    },
    {
      label: 'Valor Energético Total',
      value: isNaN(tev) ? '-' : `${toDisplayNumber(tev)} kcal`,
      icon: 'ri-flashlight-line',
      color: 'text-orange-500 bg-orange-50',
      description: 'Gasto energético total diário'
    },
    {
      label: 'Gasto Calórico por Treino',
      value: isNaN(dailyWorkoutCalories) ? '-' : `${toDisplayNumber(dailyWorkoutCalories)} kcal`,
      icon: 'ri-fire-line',
      color: 'text-yellow-500 bg-yellow-50',
      description: 'Energia gasta durante exercícios'
    },
    {
      label: 'Gasto Calórico Total',
      value: isNaN(totalCaloriesBurned) ? '-' : `${toDisplayNumber(totalCaloriesBurned)} kcal`,
      icon: 'ri-dashboard-line',
      color: 'text-green-500 bg-green-50',
      description: 'Total de energia gasta por dia'
    },
    {
      label: 'IMC',
      value: isNaN(bmi) ? '-' : `${toDisplayNumber(bmi, 2)}`,
      icon: 'ri-scales-line',
      color: 'text-blue-500 bg-blue-50',
      description: 'Índice de Massa Corporal'
    },
    {
      label: 'Peso Ideal',
      value: isNaN(idealWeight) ? '-' : `${toDisplayNumber(idealWeight, 1)} kg`,
      icon: 'ri-target-line',
      color: 'text-purple-500 bg-purple-50',
      description: 'Peso ideal para sua altura'
    },
    {
      label: '% Gordura Corporal',
      value: isNaN(bodyFatPercentage) ? '-' : `${toDisplayNumber(bodyFatPercentage, 1)}%`,
      icon: 'ri-pie-chart-line',
      color: 'text-pink-500 bg-pink-50',
      description: 'Percentual de gordura no corpo'
    },
    {
      label: 'Massa Magra',
      value: isNaN(leanBodyMass) ? '-' : `${toDisplayNumber(leanBodyMass, 1)} kg`,
      icon: 'ri-muscle-line',
      color: 'text-indigo-500 bg-indigo-50',
      description: 'Peso sem gordura corporal'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Metabólicos Calculados</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-start">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${stat.color} flex-shrink-0`}>
                <i className={`${stat.icon} text-lg`}></i>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Recomendações Diárias</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-800">{toDisplayNumber(metabolicData.waterIntakeRecommended)}ml</div>
            <div className="text-blue-600">Água</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-800">{toDisplayNumber(metabolicData.proteinNeeds)}g</div>
            <div className="text-blue-600">Proteína</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-800">{toDisplayNumber(metabolicData.carbNeeds)}g</div>
            <div className="text-blue-600">Carboidratos</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-800">{toDisplayNumber(metabolicData.fatNeeds)}g</div>
            <div className="text-blue-600">Gorduras</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetabolicStats;
