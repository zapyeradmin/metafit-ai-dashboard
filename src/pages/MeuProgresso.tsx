
import React, { useState } from 'react';
import { WeeklyChart } from '../components/WeeklyChart';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { useWorkouts } from '@/hooks/useWorkouts';

const MeuProgresso = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const { measurements, getLatestMeasurement } = useBodyMeasurements();
  const { workouts } = useWorkouts();

  const latest = getLatestMeasurement();
  
  // Calcular estatísticas de treino
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });

  const thisMonthWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return workoutDate >= monthAgo;
  });

  const completedThisWeek = thisWeekWorkouts.filter(w => w.is_completed).length;
  const completedThisMonth = thisMonthWorkouts.filter(w => w.is_completed).length;

  // Calcular sequência
  const calculateStreak = () => {
    const sortedWorkouts = [...workouts]
      .filter(w => w.is_completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const measurementData = [
    { 
      name: 'Peso', 
      current: `${latest?.weight || 79.3}kg`, 
      goal: '82kg', 
      progress: latest?.weight ? Math.min((latest.weight / 82) * 100, 100) : 65 
    },
    { 
      name: '% Gordura', 
      current: `${latest?.body_fat_percentage || 14.0}%`, 
      goal: '12%', 
      progress: latest?.body_fat_percentage ? Math.max(100 - ((latest.body_fat_percentage - 12) / 12) * 100, 0) : 75 
    },
    { 
      name: 'Massa Magra', 
      current: `${latest?.muscle_mass || 68.2}kg`, 
      goal: '72kg', 
      progress: latest?.muscle_mass ? Math.min((latest.muscle_mass / 72) * 100, 100) : 55 
    },
    { 
      name: 'Peito', 
      current: `${latest?.chest || 102}cm`, 
      goal: '108cm', 
      progress: latest?.chest ? Math.min((latest.chest / 108) * 100, 100) : 60 
    },
    { 
      name: 'Braços', 
      current: `${latest?.arms || 38}cm`, 
      goal: '42cm', 
      progress: latest?.arms ? Math.min((latest.arms / 42) * 100, 100) : 70 
    },
    { 
      name: 'Cintura', 
      current: `${latest?.waist || 82}cm`, 
      goal: '80cm', 
      progress: latest?.waist ? Math.max(100 - ((latest.waist - 80) / 80) * 100, 0) : 50 
    }
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
              <p className="text-2xl font-bold text-gray-900">{latest?.weight || 79.3}kg</p>
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
              <p className="text-2xl font-bold text-gray-900">{latest?.body_fat_percentage || 14.0}%</p>
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
              <p className="text-2xl font-bold text-gray-900">{latest?.muscle_mass || 68.2}kg</p>
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
              {measurementData.map((measurement, index) => (
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
                <span className={`text-xs px-2 py-1 rounded-full ${
                  completedThisWeek >= 5 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                }`}>
                  {completedThisWeek >= 5 ? '100%' : Math.round((completedThisWeek / 5) * 100) + '%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{completedThisWeek}/5</p>
              <p className="text-xs text-gray-600">treinos completados</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Este Mês</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  completedThisMonth >= 17 ? 'text-green-600 bg-green-100' : 'text-blue-600 bg-blue-100'
                }`}>
                  {Math.round((completedThisMonth / 20) * 100)}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{completedThisMonth}/20</p>
              <p className="text-xs text-gray-600">treinos completados</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Sequência</h4>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  {calculateStreak() > 0 ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{calculateStreak()}</p>
              <p className="text-xs text-gray-600">dias consecutivos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuProgresso;
