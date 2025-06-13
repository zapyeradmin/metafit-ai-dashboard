
import React from 'react';
import { ProgressChart } from '../components/ProgressChart';
import { WeeklyChart } from '../components/WeeklyChart';
import { useProfile } from '../hooks/useProfile';
import { useBodyMeasurements } from '../hooks/useBodyMeasurements';
import { useWorkouts } from '../hooks/useWorkouts';
import { useNutrition } from '../hooks/useNutrition';
import LoadingSpinner from '../components/plano-do-dia/LoadingSpinner';

const Index = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { getLatestMeasurement, loading: measurementsLoading } = useBodyMeasurements();
  const { getTodayWorkout, workouts, loading: workoutsLoading } = useWorkouts();
  const { getTodayMeals, loading: nutritionLoading } = useNutrition();

  const latestMeasurement = getLatestMeasurement();
  const todayWorkout = getTodayWorkout();
  const todayMeals = getTodayMeals();

  const isLoading = profileLoading || measurementsLoading || workoutsLoading || nutritionLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Calculate progress percentage based on current vs goal weight
  const calculateProgress = () => {
    if (!profile?.goal_weight || !latestMeasurement?.weight || !profile?.current_weight) return 0;
    const totalToLose = Math.abs(profile.current_weight - profile.goal_weight);
    const currentProgress = Math.abs(profile.current_weight - latestMeasurement.weight);
    return Math.min(Math.round((currentProgress / totalToLose) * 100), 100);
  };

  const progressPercentage = calculateProgress();

  // Calculate completed meals percentage
  const completedMealsCount = todayMeals.filter(meal => meal.is_completed).length;
  const totalMealsCount = todayMeals.length;
  const mealsProgress = totalMealsCount > 0 ? Math.round((completedMealsCount / totalMealsCount) * 100) : 0;

  // Get next workout from upcoming workouts
  const getNextWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return workouts.find(w => w.date >= today && !w.is_completed) || todayWorkout;
  };

  const nextWorkout = getNextWorkout();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Olá {profile?.full_name || 'Usuário'}, bem-vindo ao seu painel de controle fitness.
          </p>
        </div>
        
        {/* Date and Weather */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="text-sm text-gray-600">
            <span>{new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center mt-2 sm:mt-0 px-3 py-1 bg-white rounded-lg shadow-sm">
            <div className="w-5 h-5 flex items-center justify-center mr-2">
              <i className="ri-sun-line text-yellow-500"></i>
            </div>
            <span className="text-sm text-gray-600">28°C - São Paulo</span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Progresso Geral</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-line-chart-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-32 h-32">
                <ProgressChart />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
              <p className="text-sm text-gray-600">do objetivo alcançado</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Próximo Treino</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-calendar-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4">
              {nextWorkout ? (
                <>
                  <h4 className="text-lg font-semibold text-gray-900">{nextWorkout.name}</h4>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-time-line"></i>
                    </div>
                    <span>{new Date(nextWorkout.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span>{profile?.gym_name || 'Academia'}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Nenhum treino agendado</p>
                </div>
              )}
            </div>
            <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
              Ver Detalhes
            </button>
          </div>

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

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Métricas</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-scales-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {latestMeasurement ? (
                <>
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Peso Atual</p>
                      <p className="text-sm font-medium text-gray-900">{latestMeasurement.weight} kg</p>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                  {latestMeasurement.body_fat_percentage && (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">% Gordura</p>
                        <p className="text-sm font-medium text-gray-900">{latestMeasurement.body_fat_percentage}%</p>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                  {latestMeasurement.muscle_mass && (
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Massa Magra</p>
                        <p className="text-sm font-medium text-gray-900">{latestMeasurement.muscle_mass} kg</p>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Nenhuma medida registrada</p>
                </div>
              )}
            </div>
            <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
              Atualizar Medidas
            </button>
          </div>
        </div>

        {/* Weekly Summary and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Resumo Semanal</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">Esta Semana</button>
                  <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">Mês</button>
                </div>
              </div>
              <div className="h-72">
                <WeeklyChart />
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                <button className="text-sm text-primary hover:text-primary/80">Ver todas</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                    <i className="ri-calendar-check-line text-blue-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Atualização do Plano</p>
                    <p className="text-xs text-gray-600">Seu novo plano de treino está disponível para a próxima semana.</p>
                    <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                    <i className="ri-trophy-line text-green-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Meta Alcançada!</p>
                    <p className="text-xs text-gray-600">Você atingiu sua meta de treinos semanais. Continue assim!</p>
                    <p className="text-xs text-gray-500 mt-1">Ontem</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 flex-shrink-0">
                    <i className="ri-restaurant-line text-yellow-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Ajuste Nutricional</p>
                    <p className="text-xs text-gray-600">Seu plano alimentar foi ajustado com base nos seus últimos resultados.</p>
                    <p className="text-xs text-gray-500 mt-1">2 dias atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Treinos</h3>
              <button className="text-sm text-primary hover:text-primary/80">Ver todos</button>
            </div>
            <div className="space-y-4">
              {workouts.slice(0, 3).map((workout, index) => (
                <div key={workout.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary bg-opacity-10 flex-shrink-0">
                    <i className={`ri-${index === 0 ? 'run' : index === 1 ? 'heart-pulse' : 'boxing'}-line text-primary`}></i>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(workout.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {workout.duration_minutes ? `${workout.duration_minutes} min` : ''} - {profile?.gym_name || 'Academia'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Dicas Nutricionais</h3>
              <button className="text-sm text-primary hover:text-primary/80">Ver todas</button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Proteínas para Hipertrofia</h4>
                <p className="mt-1 text-xs text-gray-600">Consuma entre 1.6g e 2.2g de proteína por kg de peso corporal para maximizar o ganho de massa muscular.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Hidratação Adequada</h4>
                <p className="mt-1 text-xs text-gray-600">Beba pelo menos 3 litros de água por dia para manter o metabolismo ativo e a recuperação muscular eficiente.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Carboidratos Estratégicos</h4>
                <p className="mt-1 text-xs text-gray-600">Concentre o consumo de carboidratos nas refeições pré e pós-treino para maximizar a energia e recuperação.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
