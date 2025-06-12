
import React, { useState } from 'react';

const MeusDados = () => {
  const [activeTab, setActiveTab] = useState('medidas');

  const bodyMeasurements = [
    { date: '12/06/2025', weight: 79.3, bodyFat: 14.0, muscle: 68.2, chest: 102, waist: 82, arms: 38 },
    { date: '05/06/2025', weight: 79.1, bodyFat: 14.2, muscle: 67.9, chest: 101, waist: 82, arms: 37.5 },
    { date: '29/05/2025', weight: 78.8, bodyFat: 14.5, muscle: 67.4, chest: 101, waist: 83, arms: 37.5 },
    { date: '22/05/2025', weight: 78.5, bodyFat: 14.8, muscle: 66.9, chest: 100, waist: 83, arms: 37 },
  ];

  const workoutHistory = [
    { date: '12/06/2025', workout: 'Treino de Costas', duration: 65, exercises: 6, completed: true },
    { date: '10/06/2025', workout: 'Treino de Pernas', duration: 75, exercises: 8, completed: true },
    { date: '08/06/2025', workout: 'Treino de Peito', duration: 60, exercises: 7, completed: true },
    { date: '06/06/2025', workout: 'Treino de Ombros', duration: 55, exercises: 6, completed: true },
    { date: '04/06/2025', workout: 'Treino de Braços', duration: 50, exercises: 8, completed: false },
  ];

  const nutritionHistory = [
    { date: '12/06/2025', calories: 2750, protein: 165, carbs: 285, fat: 78, completion: 95 },
    { date: '11/06/2025', calories: 2680, protein: 158, carbs: 275, fat: 75, completion: 88 },
    { date: '10/06/2025', calories: 2820, protein: 172, carbs: 295, fat: 82, completion: 98 },
    { date: '09/06/2025', calories: 2590, protein: 151, carbs: 265, fat: 71, completion: 85 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus Dados</h1>
          <p className="mt-1 text-sm text-gray-600">Visualize e gerencie todo o histórico dos seus dados fitness.</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'medidas', label: 'Medidas Corporais', icon: 'ri-scales-line' },
                { id: 'treinos', label: 'Histórico de Treinos', icon: 'ri-run-line' },
                { id: 'nutricao', label: 'Dados Nutricionais', icon: 'ri-restaurant-line' },
                { id: 'exportar', label: 'Exportar Dados', icon: 'ri-download-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} w-4 h-4 mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'medidas' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Medidas Corporais</h3>
              <button className="px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90">
                <i className="ri-add-line w-4 h-4 mr-2"></i>
                Nova Medição
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Gordura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Massa Magra (kg)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peito (cm)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cintura (cm)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Braços (cm)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bodyMeasurements.map((measurement, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{measurement.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.weight}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.bodyFat}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.muscle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.chest}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.waist}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.arms}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-primary hover:text-primary/80">
                            <i className="ri-edit-line w-4 h-4"></i>
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <i className="ri-delete-bin-line w-4 h-4"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'treinos' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Treinos</h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Último mês</option>
                  <option>Últimos 3 meses</option>
                  <option>Último ano</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {workoutHistory.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${workout.completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{workout.workout}</h4>
                      <p className="text-xs text-gray-600">{workout.date} • {workout.duration} min • {workout.exercises} exercícios</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      workout.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {workout.completed ? 'Concluído' : 'Incompleto'}
                    </span>
                    <button className="text-primary hover:text-primary/80">
                      <i className="ri-eye-line w-4 h-4"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'nutricao' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Dados Nutricionais</h3>
              <button className="px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90">
                <i className="ri-add-line w-4 h-4 mr-2"></i>
                Registrar Refeição
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calorias</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proteínas (g)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carboidratos (g)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gorduras (g)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completude</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nutritionHistory.map((nutrition, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nutrition.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nutrition.calories}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nutrition.protein}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nutrition.carbs}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nutrition.fat}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${nutrition.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{nutrition.completion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'exportar' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Exportar Dados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <i className="ri-file-excel-line w-8 h-8 text-green-600 mr-3"></i>
                  <div>
                    <h4 className="text-md font-medium text-gray-900">Exportar para Excel</h4>
                    <p className="text-sm text-gray-600">Baixe todos os seus dados em formato .xlsx</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" checked readOnly className="mr-2" />
                    <span className="text-sm text-gray-700">Medidas corporais</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked readOnly className="mr-2" />
                    <span className="text-sm text-gray-700">Histórico de treinos</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked readOnly className="mr-2" />
                    <span className="text-sm text-gray-700">Dados nutricionais</span>
                  </label>
                </div>
                <button className="w-full px-4 py-2 text-sm text-white bg-green-600 rounded-button hover:bg-green-700">
                  <i className="ri-download-line w-4 h-4 mr-2"></i>
                  Baixar Excel
                </button>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-4">
                  <i className="ri-file-pdf-line w-8 h-8 text-red-600 mr-3"></i>
                  <div>
                    <h4 className="text-md font-medium text-gray-900">Relatório em PDF</h4>
                    <p className="text-sm text-gray-600">Gere um relatório completo em PDF</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <label className="flex items-center">
                    <input type="checkbox" checked readOnly className="mr-2" />
                    <span className="text-sm text-gray-700">Resumo de progresso</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked readOnly className="mr-2" />
                    <span className="text-sm text-gray-700">Gráficos e estatísticas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">Fotos de progresso</span>
                  </label>
                </div>
                <button className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-button hover:bg-red-700">
                  <i className="ri-download-line w-4 h-4 mr-2"></i>
                  Gerar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeusDados;
