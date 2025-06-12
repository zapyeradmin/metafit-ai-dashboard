
import React, { useState } from 'react';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import AddMeasurementForm from '@/components/AddMeasurementForm';
import { Button } from '@/components/ui/button';

const MeusDados = () => {
  const [activeTab, setActiveTab] = useState('measurements');
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const { measurements, loading: measurementsLoading, refetch: refetchMeasurements } = useBodyMeasurements();
  const { workouts, loading: workoutsLoading } = useWorkouts();
  const { meals, loading: mealsLoading } = useNutrition();

  const tabs = [
    { id: 'measurements', label: 'Medidas Corporais', icon: 'ri-body-scan-line' },
    { id: 'workouts', label: 'Histórico de Treinos', icon: 'ri-calendar-line' },
    { id: 'nutrition', label: 'Dados Nutricionais', icon: 'ri-restaurant-line' },
    { id: 'export', label: 'Exportar Dados', icon: 'ri-download-line' }
  ];

  const handleExportData = () => {
    const data = {
      measurements,
      workouts,
      meals,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metafit-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMeasurements = () => {
    if (measurementsLoading) {
      return <div className="text-center py-8">Carregando...</div>;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Medidas</h3>
          <Button onClick={() => setShowAddMeasurement(true)}>
            <i className="ri-add-line w-4 h-4 mr-2"></i>
            Adicionar Medidas
          </Button>
        </div>

        {measurements.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="ri-body-scan-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Nenhuma medida registrada ainda</p>
            <Button 
              onClick={() => setShowAddMeasurement(true)}
              className="mt-4"
            >
              Adicionar Primeira Medida
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Peso</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">% Gordura</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Massa Magra</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Peito</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Braços</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cintura</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((measurement) => (
                  <tr key={measurement.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{new Date(measurement.date).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4">{measurement.weight ? `${measurement.weight}kg` : '-'}</td>
                    <td className="py-3 px-4">{measurement.body_fat_percentage ? `${measurement.body_fat_percentage}%` : '-'}</td>
                    <td className="py-3 px-4">{measurement.muscle_mass ? `${measurement.muscle_mass}kg` : '-'}</td>
                    <td className="py-3 px-4">{measurement.chest ? `${measurement.chest}cm` : '-'}</td>
                    <td className="py-3 px-4">{measurement.arms ? `${measurement.arms}cm` : '-'}</td>
                    <td className="py-3 px-4">{measurement.waist ? `${measurement.waist}cm` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderWorkouts = () => {
    if (workoutsLoading) {
      return <div className="text-center py-8">Carregando...</div>;
    }

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Histórico de Treinos</h3>
        
        {workouts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="ri-calendar-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Nenhum treino registrado ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">{workout.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(workout.date).toLocaleDateString('pt-BR')} - 
                      {workout.muscle_groups.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      workout.is_completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {workout.is_completed ? 'Concluído' : 'Pendente'}
                    </span>
                    {workout.duration_minutes && (
                      <span className="text-sm text-gray-500">
                        {workout.duration_minutes}min
                      </span>
                    )}
                  </div>
                </div>
                {workout.notes && (
                  <p className="text-sm text-gray-600 mt-2">{workout.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderNutrition = () => {
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
        <h3 className="text-lg font-semibold text-gray-900">Dados Nutricionais</h3>
        
        {Object.keys(groupedMeals).length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <i className="ri-restaurant-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Nenhum dado nutricional registrado ainda</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMeals)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .slice(0, 10)
              .map(([date, dayMeals]) => {
                const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
                const totalProtein = dayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
                const totalCarbs = dayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
                const totalFat = dayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

                return (
                  <div key={date} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('pt-BR')}
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
                        <div key={meal.id} className="text-sm p-2 bg-gray-50 rounded">
                          <span className={`font-medium ${meal.is_completed ? 'text-green-600' : 'text-gray-900'}`}>
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

  const renderExport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Exportar Dados</h3>
      
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center">
          <i className="ri-download-cloud-line text-4xl text-primary mb-4"></i>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Baixar Todos os Dados</h4>
          <p className="text-sm text-gray-600 mb-6">
            Exporte todos os seus dados em formato JSON para backup ou transferência.
            Inclui medidas corporais, histórico de treinos e dados nutricionais.
          </p>
          <Button onClick={handleExportData} className="mb-4">
            <i className="ri-download-line w-4 h-4 mr-2"></i>
            Exportar Dados
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{measurements.length}</div>
              <div className="text-gray-600">Medidas</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{workouts.length}</div>
              <div className="text-gray-600">Treinos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{meals.length}</div>
              <div className="text-gray-600">Refeições</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus Dados</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visualize e gerencie todos os seus dados de fitness e nutrição.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'measurements' && renderMeasurements()}
          {activeTab === 'workouts' && renderWorkouts()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'export' && renderExport()}
        </div>

        {/* Add Measurement Modal */}
        {showAddMeasurement && (
          <AddMeasurementForm
            onClose={() => setShowAddMeasurement(false)}
            onSuccess={() => refetchMeasurements()}
          />
        )}
      </div>
    </div>
  );
};

export default MeusDados;
