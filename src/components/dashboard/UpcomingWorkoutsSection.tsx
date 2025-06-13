
import React from 'react';
import { DailyWorkout } from '../../hooks/useWorkouts';
import { Profile } from '../../hooks/useProfile';

interface UpcomingWorkoutsSectionProps {
  workouts: DailyWorkout[];
  profile: Profile | null;
}

const UpcomingWorkoutsSection = ({ workouts, profile }: UpcomingWorkoutsSectionProps) => {
  return (
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
  );
};

export default UpcomingWorkoutsSection;
