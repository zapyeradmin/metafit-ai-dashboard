
import React from "react";
import { useWorkouts } from "@/hooks/useWorkouts";

const WorkoutsTab = () => {
  const { workouts, loading: workoutsLoading } = useWorkouts();

  if (workoutsLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Histórico de Treinos
      </h3>

      {workouts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="ri-calendar-line text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">Nenhum treino registrado ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white border rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900">
                    {workout.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(workout.date).toLocaleDateString("pt-BR")} -{" "}
                    {workout.muscle_groups.join(", ")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      workout.is_completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {workout.is_completed ? "Concluído" : "Pendente"}
                  </span>
                  {workout.duration_minutes && (
                    <span className="text-sm text-gray-500">
                      {workout.duration_minutes}min
                    </span>
                  )}
                </div>
              </div>
              {workout.notes && (
                <p className="text-sm text-gray-600 mt-2">{workout.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutsTab;
