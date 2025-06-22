
import React from 'react';
import WorkoutTemplatesManager from '@/components/workouts/WorkoutTemplatesManager';

const TemplatesAdmin = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administração de Templates</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie os templates de treino do sistema.
          </p>
        </div>
        
        <WorkoutTemplatesManager />
      </div>
    </div>
  );
};

export default TemplatesAdmin;
