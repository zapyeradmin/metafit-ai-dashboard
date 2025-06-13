
import React from 'react';
import { DailyMeal } from '../../hooks/useNutrition';

interface NutritionCardProps {
  todayMeals: DailyMeal[];
}

const NutritionCard = ({ todayMeals }: NutritionCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">Plano Alimentar</h3>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
          <i className="ri-restaurant-line text-primary"></i>
        </div>
      </div>
      <div className="mt-4">
        {todayMeals.length > 0 ? (
          <div className="space-y-3">
            {todayMeals.slice(0, 4).map((meal) => (
              <div key={meal.id} className="flex items-center">
                <label className="custom-checkbox flex items-center">
                  <input type="checkbox" checked={meal.is_completed} readOnly />
                  <span className="checkmark"></span>
                  <span className="ml-7 text-sm text-gray-600">{meal.name}</span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>Nenhuma refeição planejada para hoje</p>
          </div>
        )}
      </div>
      <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
        Ver Plano Completo
      </button>
    </div>
  );
};

export default NutritionCard;
