import React from 'react';
import { DailyMeal } from '@/hooks/useNutrition';
import { useMetabolicCalculations } from '@/hooks/useMetabolicCalculations';

interface NutritionStatsProps {
  meals: DailyMeal[];
}

const NutritionStats = ({ meals }: NutritionStatsProps) => {
  const { metabolicData, isLoading } = useMetabolicCalculations(meals);

  if (isLoading) return <div>Carregando...</div>;

  const stats = [
    {
      label: 'Total de Proteínas',
      value: `${Math.round(metabolicData.totalProtein)}g`,
      icon: 'ri-leaf-line',
      color: 'text-green-500 bg-green-50'
    },
    {
      label: 'Total de Carboidratos',
      value: `${Math.round(metabolicData.totalCarbs)}g`,
      icon: 'ri-plant-line',
      color: 'text-blue-500 bg-blue-50'
    },
    {
      label: 'Total de Gorduras',
      value: `${Math.round(metabolicData.totalFat)}g`,
      icon: 'ri-drop-line',
      color: 'text-yellow-500 bg-yellow-50'
    },
    {
      label: 'Calorias Necessárias',
      value: `${metabolicData.tev} kcal`,
      icon: 'ri-target-line',
      color: 'text-purple-500 bg-purple-50'
    },
    {
      label: 'Calorias Consumidas',
      value: `${metabolicData.caloriesConsumed} kcal`,
      icon: 'ri-restaurant-line',
      color: 'text-orange-500 bg-orange-50'
    },
    {
      label: 'Diferença',
      value: `${metabolicData.diffCalories} kcal`,
      icon: 'ri-scales-line',
      color: metabolicData.diffCalories >= 0 
        ? 'text-red-500 bg-red-50' 
        : 'text-green-500 bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

export default NutritionStats;
