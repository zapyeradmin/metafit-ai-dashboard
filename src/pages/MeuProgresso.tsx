
import React, { useState } from 'react';
import { WeeklyChart } from '../components/WeeklyChart';

const MeuProgresso = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const progressData = {
    weight: [
      { date: '01/12', value: 78.2 },
      { date: '08/12', value: 78.5 },
      { date: '15/12', value: 78.8 },
      { date: '22/12', value: 79.1 },
      { date: '29/12', value: 79.3 },
    ],
    bodyFat: [
      { date: '01/12', value: 15.2 },
      { date: '08/12', value: 14.8 },
      { date: '15/12', value: 14.5 },
      { date: '22/12', value: 14.2 },
      { date: '29/12', value: 14.0 },
    ]
  };

  const measurements = [
    { name: 'Peso', current: '79.3kg', goal: '82kg', progress: 65 },
    { name: '% Gordura', current: '14.0%', goal: '12%', progress: 75 },
    { name: 'Massa Magra', current: '68.2kg', goal: '72kg', progress: 55 },
    { name: 'Peito', current: '102cm', goal: '108cm', progress: 60 },
    { name: 'Braços', current: '38cm', goal: '42cm', progress: 70 },
    { name: 'Cintura', current: '82cm', goal: '80cm', progress: 50 }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meu Progresso</h1>
          <p className="mt-1 text-sm text-gray-600">Acompanhe sua evolução física e de desempenho.</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['semana', 'mes', 'trimestre', 'ano'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm rounded-lg ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Peso Atual</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                <i className="ri-scales-line text-blue-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">79.3kg</p>
              <p className="text-sm text-green-600">+1.1kg este mês</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">% Gordura</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                <i className="ri-heart-pulse-line text-green-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">14.0%</p>
              <p className="text-sm text-green-600">-1.2% este mês</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Massa Magra</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100">
                <i className="ri-body-scan-line text-purple-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">68.2kg</p>
              <p className="text-sm text-green-600">+2.1kg este mês</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Meta do Mês</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100">
                <i className="ri-target-line text-orange-600"></i>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-green-600">No prazo</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Progresso */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Evolução do Peso</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs text-primary bg-primary/10 rounded-full">Peso</button>
                <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">% Gordura</button>
              </div>
            </div>
            <WeeklyChart />
          </div>

          {/* Medidas Corporais */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Medidas Corporais</h3>
              <button className="text-sm text-primary hover:text-primary/80">Atualizar</button>
            </div>
            <div className="space-y-4">
              {measurements.map((measurement, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{measurement.name}</span>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{measurement.current}</span>
                      <span className="text-gray-400 ml-1">/ {measurement.goal}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${measurement.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Histórico de Treinos */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Treinos</h3>
            <button className="text-sm text-primary hover:text-primary/80">Ver todos</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Esta Semana</h4>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">100%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">5/5</p>
              <p className="text-xs text-gray-600">treinos completados</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Este Mês</h4>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">85%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">17/20</p>
              <p className="text-xs text-gray-600">treinos completados</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Sequência</h4>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Ativo</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-600">dias consecutivos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuProgresso;
