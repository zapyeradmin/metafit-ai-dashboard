
import React from 'react';
import { useDailyMacros } from "@/hooks/useDailyMacros";

interface NutritionStatsProps {
  selectedDate?: string;
  // Removido: meals: any[];
}

const toDisplayNumber = (value: any, decimals = 0) => {
  if (value == null) return '-';
  const num = Number(value);
  if (isNaN(num)) return '-';
  return decimals > 0 ? num.toFixed(decimals) : Math.round(num);
};

const NutritionStats = ({ selectedDate }: NutritionStatsProps) => {
  const dateStr = selectedDate ?? new Date().toISOString().split('T')[0];
  const { data: dailyMacros, isLoading } = useDailyMacros(dateStr);

  if (isLoading) return <div>Carregando...</div>;
  if (!dailyMacros) return <div>Nenhum dado encontrado para o dia.</div>;

  const stats = [
    {
      label: 'Total de Proteínas',
      value: `${toDisplayNumber(dailyMacros.total_protein)}g`,
      icon: 'ri-leaf-line',
      color: 'text-green-500 bg-green-50'
    },
    {
      label: 'Total de Carboidratos',
      value: `${toDisplayNumber(dailyMacros.total_carbs)}g`,
      icon: 'ri-plant-line',
      color: 'text-blue-500 bg-blue-50'
    },
    {
      label: 'Total de Gorduras',
      value: `${toDisplayNumber(dailyMacros.total_fat)}g`,
      icon: 'ri-drop-line',
      color: 'text-yellow-500 bg-yellow-50'
    },
    {
      label: 'Calorias Consumidas',
      value: `${toDisplayNumber(dailyMacros.total_calories)} kcal`,
      icon: 'ri-restaurant-line',
      color: 'text-orange-500 bg-orange-50'
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
