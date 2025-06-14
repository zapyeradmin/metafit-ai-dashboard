
import React from "react";
import { useNutrition } from "@/hooks/useNutrition";

const NutritionTab = () => {
  const { meals, loading: mealsLoading } = useNutrition();

  if (mealsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  const groupedMeals = meals.reduce((acc, meal) => {
    const date = meal.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Dados Nutricionais
      </h3>

      {Object.keys(groupedMeals).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-restaurant-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">
            Nenhum dado nutricional registrado ainda
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMeals)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .slice(0, 10)
            .map(([date, dayMeals]) => {
              const totalCalories = dayMeals.reduce(
                (sum, meal) => sum + (meal.calories || 0),
                0
              );
              const totalProtein = dayMeals.reduce(
                (sum, meal) => sum + (meal.protein || 0),
                0
              );
              const totalCarbs = dayMeals.reduce(
                (sum, meal) => sum + (meal.carbs || 0),
                0
              );
              const totalFat = dayMeals.reduce(
                (sum, meal) => sum + (meal.fat || 0),
                0
              );

              return (
                <div key={date} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">
                      {new Date(date).toLocaleDateString("pt-BR")}
                    </h4>
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>{totalCalories} kcal</span>
                      <span>{totalProtein.toFixed(1)}g prot</span>
                      <span>{totalCarbs.toFixed(1)}g carb</span>
                      <span>{totalFat.toFixed(1)}g gord</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {dayMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="text-sm p-2 bg-gray-50 rounded"
                      >
                        <span
                          className={`font-medium ${
                            meal.is_completed
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {meal.name}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {meal.calories} kcal
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default NutritionTab;
