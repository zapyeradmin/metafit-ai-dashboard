
import React from 'react';
import { DailyWorkout } from '../../hooks/useWorkouts';
import { Profile } from '../../hooks/useProfile';

interface NextWorkoutCardProps {
  nextWorkout: DailyWorkout | undefined;
  profile: Profile | null;
}

const NextWorkoutCard = ({ nextWorkout, profile }: NextWorkoutCardProps) => {
  return (
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
  );
};

export default NextWorkoutCard;
