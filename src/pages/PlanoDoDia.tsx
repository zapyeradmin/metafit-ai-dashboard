
import React, { useState } from 'react';

const PlanoDoDia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayWorkout = {
    name: "Treino de Costas",
    exercises: [
      { name: "Puxada Frontal", sets: 4, reps: "12-15", weight: "45kg", completed: true },
      { name: "Remada Curvada", sets: 4, reps: "10-12", weight: "60kg", completed: true },
      { name: "Levantamento Terra", sets: 3, reps: "8-10", weight: "80kg", completed: false },
      { name: "Pulley", sets: 3, reps: "12-15", weight: "35kg", completed: false }
    ],
    duration: "60-75 min",
    time: "18:30"
  };

  const todayMeals = [
    { name: "Café da manhã", time: "07:00", calories: 450, completed: true },
    { name: "Lanche da manhã", time: "09:30", calories: 200, completed: true },
    { name: "Almoço", time: "12:30", calories: 650, completed: true },
    { name: "Lanche da tarde", time: "15:30", calories: 300, completed: false },
    { name: "Jantar", time: "19:00", calories: 550, completed: false },
    { name: "Ceia", time: "21:30", calories: 200, completed: false }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Plano do Dia</h1>
          <p className="mt-1 text-sm text-gray-600">Organize seu treino e alimentação de hoje.</p>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center mt-6 px-3 py-1 bg-white rounded-lg shadow-sm">
              <i className="ri-sun-line text-yellow-500 w-5 h-5 mr-2"></i>
              <span className="text-sm text-gray-600">28°C - São Paulo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Treino do Dia */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Treino de Hoje</h3>
              <div className="flex items-center text-sm text-gray-600">
                <i className="ri-time-line w-4 h-4 mr-1"></i>
                <span>{todayWorkout.time}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">{todayWorkout.name}</h4>
                <span className="text-sm text-gray-500">{todayWorkout.duration}</span>
              </div>
            </div>

            <div className="space-y-3">
              {todayWorkout.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <label className="custom-checkbox flex items-center">
                      <input type="checkbox" checked={exercise.completed} readOnly />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="ml-4 flex-1">
                    <h5 className="text-sm font-medium text-gray-900">{exercise.name}</h5>
                    <p className="text-xs text-gray-600">
                      {exercise.sets} séries × {exercise.reps} reps • {exercise.weight}
                    </p>
                  </div>
                  {exercise.completed && (
                    <div className="text-green-500">
                      <i className="ri-check-line w-5 h-5"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90">
                Iniciar Treino
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-button hover:bg-gray-200">
                <i className="ri-edit-line w-4 h-4"></i>
              </button>
            </div>
          </div>

          {/* Plano Alimentar do Dia */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Alimentação de Hoje</h3>
              <div className="text-sm text-gray-600">
                <span>2.350 / 2.800 kcal</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">84% da meta diária</p>
            </div>

            <div className="space-y-3">
              {todayMeals.map((meal, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <label className="custom-checkbox flex items-center">
                      <input type="checkbox" checked={meal.completed} readOnly />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-900">{meal.name}</h5>
                      <span className="text-xs text-gray-500">{meal.time}</span>
                    </div>
                    <p className="text-xs text-gray-600">{meal.calories} kcal</p>
                  </div>
                  {meal.completed && (
                    <div className="text-green-500">
                      <i className="ri-check-line w-5 h-5"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90">
                Ver Detalhes
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-button hover:bg-gray-200">
                <i className="ri-add-line w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Resumo do Dia */}
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
      </div>
    </div>
  );
};

export default PlanoDoDia;
