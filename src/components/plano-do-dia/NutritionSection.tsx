
import React from 'react';
import { Button } from '@/components/ui/button';

interface Meal {
  id: string;
  name: string;
  meal_type: string;
  calories: number;
  is_completed: boolean;
}

interface NutritionSectionProps {
  todayMeals: Meal[];
  onCompleteMeal: (mealId: string) => void;
}

const NutritionSection = ({ todayMeals, onCompleteMeal }: NutritionSectionProps) => {
  const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const targetCalories = 2800;
  const caloriesProgress = (totalCalories / targetCalories) * 100;

  const getMealTime = (mealType: string) => {
    const times = {
      'cafe_manha': '07:00',
      'lanche_manha': '09:30',
      'almoco': '12:30',
      'lanche_tarde': '15:30',
      'jantar': '19:00',
      'ceia': '21:30'
    };
    return times[mealType as keyof typeof times] || '00:00';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alimentação de Hoje</h3>
        <div className="text-sm text-gray-600">
          <span>{totalCalories} / {targetCalories} kcal</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {Math.round(caloriesProgress)}% da meta diária
        </p>
      </div>

      <div className="space-y-3">
        {todayMeals.map((meal) => (
          <div key={meal.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={meal.is_completed}
                onChange={() => onCompleteMeal(meal.id)}
                className="h-4 w-4 text-primary"
              />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <h5 className="text-sm font-medium text-gray-900">{meal.name}</h5>
                <span className="text-xs text-gray-500">
                  {getMealTime(meal.meal_type)}
                </span>
              </div>
              <p className="text-xs text-gray-600">{meal.calories} kcal</p>
            </div>
            {meal.is_completed && (
              <div className="text-green-500">
                <i className="ri-check-line w-5 h-5"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex space-x-3">
        <Button className="flex-1">
          Ver Detalhes
        </Button>
        <Button variant="outline" size="sm">
          <i className="ri-add-line w-4 h-4"></i>
        </Button>
      </div>
    </div>
  );
};

export default NutritionSection;
