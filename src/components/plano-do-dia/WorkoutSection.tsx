
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WorkoutExercise {
  id: string;
  sets: number;
  reps: number;
  weight: number;
  is_completed: boolean;
  exercise?: {
    name: string;
  };
}

interface Workout {
  id: string;
  name: string;
}

interface WorkoutSectionProps {
  todayWorkout: Workout | null;
  workoutExercises: WorkoutExercise[];
  onCompleteExercise: (exerciseId: string) => void;
}

const WorkoutSection = ({ todayWorkout, workoutExercises, onCompleteExercise }: WorkoutSectionProps) => {
  const { toast } = useToast();

  const handleStartWorkout = () => {
    if (!todayWorkout) return;
    
    toast({
      title: "Treino Iniciado!",
      description: "Bom treino! Lembre-se de marcar os exercícios conforme completa."
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Treino de Hoje</h3>
        <div className="flex items-center text-sm text-gray-600">
          <i className="ri-time-line w-4 h-4 mr-1"></i>
          <span>18:30</span>
        </div>
      </div>

      {todayWorkout && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">{todayWorkout.name}</h4>
            <span className="text-sm text-gray-500">60-75 min</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {workoutExercises.map((exercise) => (
          <div key={exercise.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={exercise.is_completed}
                onChange={() => onCompleteExercise(exercise.id)}
                className="h-4 w-4 text-primary"
              />
            </div>
            <div className="ml-4 flex-1">
              <h5 className="text-sm font-medium text-gray-900">
                {exercise.exercise?.name || 'Exercício'}
              </h5>
              <p className="text-xs text-gray-600">
                {exercise.sets} séries × {exercise.reps} reps • {exercise.weight}kg
              </p>
            </div>
            {exercise.is_completed && (
              <div className="text-green-500">
                <i className="ri-check-line w-5 h-5"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex space-x-3">
        <Button 
          onClick={handleStartWorkout}
          className="flex-1"
          disabled={!todayWorkout}
        >
          Iniciar Treino
        </Button>
        <Button variant="outline" size="sm">
          <i className="ri-edit-line w-4 h-4"></i>
        </Button>
      </div>
    </div>
  );
};

export default WorkoutSection;
