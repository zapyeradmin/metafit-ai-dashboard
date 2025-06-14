
import React from 'react';
import { DailyWorkout } from '../../hooks/useWorkouts';
import { Profile } from '../../hooks/useProfile';

interface UpcomingWorkoutsSectionProps {
  workouts: DailyWorkout[];
  profile: Profile | null;
}

const UpcomingWorkoutsSection = ({ workouts, profile }: UpcomingWorkoutsSectionProps) => {
  // Filter for upcoming workouts (today and future, not completed)
  const today = new Date().toISOString().split('T')[0];
  const upcomingWorkouts = workouts
    .filter(w => w.date >= today && !w.is_completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const getWorkoutIcon = (index: number, muscleGroups: string[] = []) => {
    if (muscleGroups.includes('peito') || muscleGroups.includes('pernas')) return 'ri-boxing-line';
    if (muscleGroups.includes('cardio')) return 'ri-run-line';
    if (muscleGroups.includes('costas') || muscleGroups.includes('braços')) return 'ri-heart-pulse-line';
    return index === 0 ? 'ri-run-line' : index === 1 ? 'ri-heart-pulse-line' : 'ri-boxing-line';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Hoje';
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Amanhã';
    
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Próximos Treinos</h3>
        <button className="text-sm text-primary hover:text-primary/80">Ver todos</button>
      </div>
      
      {upcomingWorkouts.length > 0 ? (
        <div className="space-y-4">
          {upcomingWorkouts.map((workout, index) => (
            <div key={workout.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary bg-opacity-10 flex-shrink-0">
                <i className={`${getWorkoutIcon(index, workout.muscle_groups || [])} text-primary`}></i>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                    <p className="text-xs text-gray-600">
                      {workout.muscle_groups && workout.muscle_groups.length > 0 
                        ? workout.muscle_groups.join(', ')
                        : 'Treino geral'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 font-medium">
                      {formatDate(workout.date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {workout.duration_minutes ? `${workout.duration_minutes} min` : ''}
                    </p>
                  </div>
                </div>
                {profile?.gym_name && (
                  <p className="text-xs text-gray-500 mt-1">
                    <i className="ri-map-pin-line mr-1"></i>
                    {profile.gym_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mx-auto mb-4">
            <i className="ri-calendar-line text-gray-400 text-xl"></i>
          </div>
          <p className="text-gray-500">Nenhum treino agendado</p>
          <p className="text-xs text-gray-400 mt-1">Que tal criar um plano de treinos?</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingWorkoutsSection;
