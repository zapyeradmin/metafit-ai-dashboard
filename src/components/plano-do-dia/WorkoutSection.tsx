
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Tipos
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

// Função para agrupar exercícios por grupo muscular (exceto aeróbico/alongamento)
function groupExercises(workoutExercises: WorkoutExercise[]) {
  const groupMap: { [key: string]: WorkoutExercise[] } = {};
  const funcional: WorkoutExercise[] = [];

  workoutExercises.forEach((ex) => {
    // Detecta aeróbico/alongamento (sem nome de exercício mas com notes)
    if (!ex.exercise?.name && ex.notes) {
      funcional.push(ex);
      return;
    }
    // Se tem nome/músculo, agrupa
    const muscle = ex.exercise?.muscle_group ?? 'Outro';
    if (!groupMap[muscle]) groupMap[muscle] = [];
    groupMap[muscle].push(ex);
  });

  return { groupMap, funcional };
}

const WorkoutSection = ({
  todayWorkout,
  workoutExercises,
  onCompleteExercise,
}: WorkoutSectionProps) => {
  const { toast } = useToast();

  const handleStartWorkout = () => {
    if (!todayWorkout) return;
    toast({
      title: 'Treino Iniciado!',
      description: 'Bom treino! Lembre-se de marcar os exercícios conforme completa.',
    });
  };

  const { groupMap, funcional } = groupExercises(workoutExercises);

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

      {/* Lista de grupos musculares e exercícios */}
      <div className="space-y-5">
        {Object.entries(groupMap).map(([mg, exList]) =>
          exList.length > 0 ? (
            <div key={mg}>
              <div className="font-semibold mb-2 text-blue-700">{mg}</div>
              <div className="space-y-2">
                {exList.map((exercise, idx) => {
                  const nome = exercise.exercise?.name || exercise.notes || "Exercício";
                  const sets =
                    typeof exercise.sets === "number" && exercise.sets > 0
                      ? `${exercise.sets} séries`
                      : "— séries";
                  const reps =
                    typeof exercise.reps === "number" && exercise.reps > 0
                      ? `× ${exercise.reps} reps`
                      : "× — reps";
                  const weight =
                    typeof exercise.weight === "number" && exercise.weight > 0
                      ? `• ${exercise.weight}kg`
                      : "";
                  return (
                    <div
                      key={exercise.id || idx}
                      className="flex items-center p-3 bg-gray-50 rounded-lg mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={exercise.is_completed}
                        onChange={() => exercise.id && onCompleteExercise(exercise.id)}
                        className="h-4 w-4 text-primary"
                      />
                      <div className="ml-4 flex-1">
                        <h5 className="text-sm font-medium text-gray-900">
                          {nome}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {sets} {reps} {weight}
                        </p>
                      </div>
                      {exercise.is_completed && (
                        <div className="text-green-500 ml-2">
                          <i className="ri-check-line w-5 h-5"></i>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null
        )}

        {/* Exibe aeróbico e alongamento */}
        {funcional.length > 0 && (
          <div>
            <div className="font-semibold mb-2 text-green-700">Aeróbico / Alongamento</div>
            <div className="space-y-2">
              {funcional.map((exercise, idx) => (
                <div
                  key={`funcional-${idx}`}
                  className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-800 mr-3">
                    {exercise.notes?.toLowerCase().includes("aeróbico") ? "🏃" : "🧘"}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-green-800">
                      {exercise.notes || "Atividade"}
                    </h5>
                  </div>
                  {exercise.is_completed && (
                    <div className="text-green-500 ml-2">
                      <i className="ri-check-line w-5 h-5"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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

