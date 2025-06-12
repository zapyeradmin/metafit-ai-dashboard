
import React from 'react';
import { ProgressChart } from '../components/ProgressChart';
import { WeeklyChart } from '../components/WeeklyChart';

const DashboardPro = () => {
  const proMetrics = [
    { 
      title: 'Taxa Metabólica Basal', 
      value: '1,847', 
      unit: 'kcal/dia', 
      change: '+2.3%',
      color: 'blue',
      icon: 'ri-fire-line'
    },
    { 
      title: 'Vo2 Máximo Estimado', 
      value: '45.2', 
      unit: 'ml/kg/min', 
      change: '+5.1%',
      color: 'green',
      icon: 'ri-heart-pulse-line'
    },
    { 
      title: 'Frequência Cardíaca de Repouso', 
      value: '58', 
      unit: 'bpm', 
      change: '-3.2%',
      color: 'red',
      icon: 'ri-pulse-line'
    },
    { 
      title: 'Índice de Fadiga', 
      value: '2.1', 
      unit: '/10', 
      change: '-15%',
      color: 'purple',
      icon: 'ri-battery-line'
    }
  ];

  const workoutAnalysis = [
    { muscle: 'Peito', frequency: 2, lastWorkout: '2 dias', recovery: 'Recuperado', color: 'green' },
    { muscle: 'Costas', frequency: 2, lastWorkout: 'Hoje', recovery: 'Em treino', color: 'blue' },
    { muscle: 'Pernas', frequency: 2, lastWorkout: '1 dia', recovery: 'Recuperando', color: 'yellow' },
    { muscle: 'Ombros', frequency: 2, lastWorkout: '3 dias', recovery: 'Recuperado', color: 'green' },
    { muscle: 'Bíceps', frequency: 2, lastWorkout: '1 dia', recovery: 'Recuperando', color: 'yellow' },
    { muscle: 'Tríceps', frequency: 2, lastWorkout: '2 dias', recovery: 'Recuperado', color: 'green' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard PRO</h1>
            <span className="ml-3 px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              PRO
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">Análises avançadas e métricas detalhadas do seu desempenho.</p>
        </div>

        {/* Métricas Avançadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {proMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-primary">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-${metric.color}-100`}>
                  <i className={`${metric.icon} text-${metric.color}-600`}></i>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <span className="ml-1 text-sm text-gray-500">{metric.unit}</span>
                </div>
                <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') && metric.title.includes('Fadiga') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                  {metric.change} vs mês anterior
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Análise de Volume de Treino */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Volume de Treino Semanal</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs text-primary bg-primary/10 rounded-full">Sets</button>
                <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">Carga</button>
              </div>
            </div>
            <WeeklyChart />
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">156</p>
                <p className="text-xs text-gray-600">Sets totais</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">12.8t</p>
                <p className="text-xs text-gray-600">Volume total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">4.2</p>
                <p className="text-xs text-gray-600">Intensidade média</p>
              </div>
            </div>
          </div>

          {/* Análise de Recuperação */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Estado de Recuperação</h3>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Ótimo</span>
              </div>
            </div>
            <div className="space-y-4">
              {workoutAnalysis.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 bg-${item.color}-500 rounded-full mr-3`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.muscle}</p>
                      <p className="text-xs text-gray-600">{item.frequency}x/semana</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{item.recovery}</p>
                    <p className="text-xs text-gray-600">Último: {item.lastWorkout}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Análise Nutricional Avançada */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Análise Nutricional Detalhada</h3>
            <button className="text-sm text-primary hover:text-primary/80">Ajustar macros</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <ProgressChart />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Proteínas</h4>
              <p className="text-2xl font-bold text-gray-900">165g</p>
              <p className="text-xs text-gray-600">Meta: 180g (92%)</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <ProgressChart />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Carboidratos</h4>
              <p className="text-2xl font-bold text-gray-900">285g</p>
              <p className="text-xs text-gray-600">Meta: 320g (89%)</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <ProgressChart />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Gorduras</h4>
              <p className="text-2xl font-bold text-gray-900">78g</p>
              <p className="text-xs text-gray-600">Meta: 85g (92%)</p>
            </div>
          </div>
        </div>

        {/* Previsões e Recomendações IA */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 mr-3">
              <i className="ri-robot-line text-purple-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Insights de IA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Previsão de Progresso</h4>
              <p className="text-xs text-gray-600">
                Com base no seu progresso atual, você deve atingir 81kg em aproximadamente 6 semanas, 
                mantendo o ritmo atual de ganho de massa magra.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recomendação</h4>
              <p className="text-xs text-gray-600">
                Considere aumentar a intensidade dos treinos de pernas em 10% e adicionar 
                15g de proteína na refeição pós-treino para otimizar resultados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPro;
