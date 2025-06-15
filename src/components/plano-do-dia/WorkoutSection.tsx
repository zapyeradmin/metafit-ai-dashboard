
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Novo tipo para melhor organização interna
interface WorkoutExercise {
  id?: string;
  sets: number;
  reps: number;
  weight: number;
  is_completed: boolean;
  notes?: string | null;
  exercise?: {
    name: string;
    muscle_group?: string;
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

const formatMuscleGroup = (name: string) => {
  return name
    .replace('Quadríceps', 'Quadríceps')
    .replace('Posterior de Pernas', 'Posterior de Pernas')
    .replace('Panturrilha', 'Panturrilha')
    .replace('Glúteos', 'Glúteos')
    .replace('Ombros', 'Ombros')
    .replace('Abdômen', 'Abdômen')
    .replace('Costas', 'Costas')
    .replace('Peito', 'Peito')
    .replace('Tríceps', 'Tríceps')
    .replace('Bíceps', 'Bíceps');
};

const getMuscleGroupsOrder = (todayWorkout: Workout | null) => {
  if (!todayWorkout || !todayWorkout.name) return [];
  // Mapear os nomes das divisões aos grupos musculares
  switch (todayWorkout.name) {
    case "Costas e Bíceps": return ["Costas", "Bíceps"];
    case "Peito e Tríceps": return ["Peito", "Tríceps"];
    case "Pernas (Quadríceps, Glúteos, Panturrilha)": return ["Quadríceps", "Glúteos", "Panturrilha"];
    case "Ombros e Abdômen": return ["Ombros", "Abdômen"];
    case "Posterior de Pernas, Glúteos e Panturrilha": return ["Posterior de Pernas", "Glúteos", "Panturrilha"];
    default: return [];
  }
};

// Agrupa exercícios por grupo muscular
const groupExercisesByMuscle = (exercises: WorkoutExercise[], muscleGroupsOrder: string[]) => {
  const muscleGroups: { [key: string]: WorkoutExercise[] } = {};
  const cardioAndStretch: WorkoutExercise[] = [];
  exercises.forEach(ex => {
    // Se é aeróbico/alongamento marcado apenas em notes
    if (!ex.exercise?.name && ex.notes) {
      cardioAndStretch.push(ex);
      return;
    }
    // Caso padrão: separa pelo muscle_group, se disponível
    const mg = ex.exercise?.muscle_group || '';
    const foundGroup = muscleGroupsOrder.find(orderMg =>
      mg?.toLowerCase().includes(orderMg.toLowerCase())
    ) || mg || 'Outro';

    if (!muscleGroups[foundGroup]) muscleGroups[foundGroup] = [];
    muscleGroups[foundGroup].push(ex);
  });
  return { muscleGroups, cardioAndStretch };
};

const WorkoutSection = ({ todayWorkout, workoutExercises, onCompleteExercise }: WorkoutSectionProps) => {
  const { toast } = useToast();

  const handleStartWorkout = () => {
    if (!todayWorkout) return;    
    toast({
      title: "Treino Iniciado!",
      description: "Bom treino! Lembre-se de marcar os exercícios conforme completa."
    });
  };

  // Separa por grupos musculares e inclui aeróbico/along
  const muscleGroupsOrder = getMuscleGroupsOrder(todayWorkout);
  const { muscleGroups, cardioAndStretch } = groupExercisesByMuscle(workoutExercises, muscleGroupsOrder);

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
            <h4 className="text-md font-medium text-primary">{todayWorkout.name}</h4>
            <span className="text-sm text-gray-500">60-75 min</span>
          </div>
        </div>
      )}
      {/* Exibe grupos musculares e seus exercícios */}
      <div className="space-y-3">
        {muscleGroupsOrder.map(mg =>
          muscleGroups[mg]?.length ? (
            <div key={mg}>
              <div className="font-semibold mb-2 text-blue-600">{mg}</div>
              {muscleGroups[mg].map((exercise, idx) => (
                <div key={exercise.id || idx} className="flex items-center p-3 bg-gray-50 rounded-lg mb-1">
                  <div>
                    <input 
                      type="checkbox" 
                      checked={exercise.is_completed}
                      onChange={() => exercise.id && onCompleteExercise(exercise.id)}
                      className="h-4 w-4 text-primary"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h5 className="text-sm font-medium text-gray-900">
                      {exercise.exercise?.name || 'Exercício'}
                    </h5>
                    <p className="text-xs text-gray-600">
                      {exercise.sets} séries × {exercise.reps} reps • {exercise.weight ?? 0}kg
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
          ) : null
        )}
        {/* Exibe aeróbico e alongamento destacados */}
        {cardioAndStretch.map((exercise, idx) => (
          <div
            key={`cardio-${idx}`}
            className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200 mt-4"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-800 mr-3">
              {exercise.notes?.toLowerCase().includes('aeróbico') ? '🏃' : '🧘'}
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-green-800">
                {exercise.notes}
              </h5>
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
