
import React, { useState, useEffect } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const PlanoDoDia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutExercises, setWorkoutExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { workouts, getTodayWorkout, completeWorkout, completeExercise, refetch: refetchWorkouts } = useWorkouts();
  const { meals, getTodayMeals, completeMeal, refetch: refetchMeals } = useNutrition();
  const { toast } = useToast();

  const todayWorkout = getTodayWorkout();
  const todayMeals = getTodayMeals();

  useEffect(() => {
    if (todayWorkout) {
      fetchWorkoutExercises();
    } else {
      createDefaultWorkout();
    }
  }, [todayWorkout?.id]);

  useEffect(() => {
    if (todayMeals.length === 0) {
      createDefaultMeals();
    }
  }, [todayMeals.length]);

  const fetchWorkoutExercises = async () => {
    if (!todayWorkout) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
          *,
          exercise:exercises(name, muscle_group, equipment)
        `)
        .eq('daily_workout_id', todayWorkout.id)
        .order('order_index');

      if (error) {
        console.error('Error fetching exercises:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar exercícios",
          variant: "destructive"
        });
        return;
      }

      setWorkoutExercises(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar exercícios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultWorkout = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);

      // Criar treino do dia
      const { data: workout, error: workoutError } = await supabase
        .from('daily_workouts')
        .insert({
          user_id: user.id,
          date: selectedDate,
          name: "Treino de Costas",
          muscle_groups: ['costas', 'biceps'],
          is_completed: false
        })
        .select()
        .single();

      if (workoutError) {
        console.error('Error creating workout:', workoutError);
        return;
      }

      // Buscar exercícios de costas
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .in('muscle_group', ['Costas', 'Bíceps'])
        .limit(4);

      if (exercises && exercises.length > 0) {
        const workoutExerciseData = exercises.map((exercise, index) => ({
          daily_workout_id: workout.id,
          exercise_id: exercise.id,
          sets: 4,
          reps: index === 2 ? 8 : 12,
          weight: index === 2 ? 80 : index === 1 ? 60 : 45,
          rest_seconds: 90,
          order_index: index,
          is_completed: index < 2
        }));

        await supabase
          .from('workout_exercises')
          .insert(workoutExerciseData);
      }

      // Recarregar dados ao invés de reload da página
      await refetchWorkouts();
      toast({
        title: "Sucesso",
        description: "Treino criado com sucesso!"
      });
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar treino",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setLoading(true);

      const defaultMeals = [
        { meal_type: 'cafe_manha', name: 'Café da manhã', calories: 450, protein: 25, carbs: 45, fat: 15 },
        { meal_type: 'lanche_manha', name: 'Lanche da manhã', calories: 200, protein: 15, carbs: 20, fat: 8 },
        { meal_type: 'almoco', name: 'Almoço', calories: 650, protein: 40, carbs: 60, fat: 20 },
        { meal_type: 'lanche_tarde', name: 'Lanche da tarde', calories: 300, protein: 20, carbs: 25, fat: 12 },
        { meal_type: 'jantar', name: 'Jantar', calories: 550, protein: 35, carbs: 45, fat: 18 },
        { meal_type: 'ceia', name: 'Ceia', calories: 200, protein: 15, carbs: 15, fat: 10 }
      ];

      const mealsData = defaultMeals.map((meal, index) => ({
        user_id: user.id,
        date: selectedDate,
        ...meal,
        is_completed: index < 3
      }));

      const { error } = await supabase
        .from('daily_meals')
        .insert(mealsData);

      if (error) {
        console.error('Error creating meals:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar refeições",
          variant: "destructive"
        });
        return;
      }

      // Recarregar dados ao invés de reload da página
      await refetchMeals();
      toast({
        title: "Sucesso",
        description: "Refeições criadas com sucesso!"
      });
    } catch (error) {
      console.error('Error creating meals:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar refeições",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteExercise = async (exerciseId: string) => {
    try {
      await completeExercise(exerciseId);
      await fetchWorkoutExercises(); // Recarregar exercícios
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const handleCompleteMeal = async (mealId: string) => {
    try {
      await completeMeal(mealId);
    } catch (error) {
      console.error('Error completing meal:', error);
    }
  };

  const handleStartWorkout = () => {
    if (!todayWorkout) return;
    
    toast({
      title: "Treino Iniciado!",
      description: "Bom treino! Lembre-se de marcar os exercícios conforme completa."
    });
  };

  const totalCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const targetCalories = 2800;
  const caloriesProgress = (totalCalories / targetCalories) * 100;

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Plano do Dia</h1>
          <p className="mt-1 text-sm text-gray-600">Organize seu treino e alimentação de hoje.</p>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <div className="flex items-center mt-6 px-3 py-1 bg-white rounded-lg shadow-sm">
              <i className="ri-sun-line text-yellow-500 w-5 h-5 mr-2"></i>
              <span className="text-sm text-gray-600">28°C - São Paulo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Treino do Dia */}
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
                      onChange={() => handleCompleteExercise(exercise.id)}
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

          {/* Plano Alimentar do Dia */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Alimentação de Hoje</h3>
              <div className="text-sm text-gray-600">
                <span>{totalCalories} / {targetCalories} kcal</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round(caloriesProgress)}% da meta diária
              </p>
            </div>

            <div className="space-y-3">
              {todayMeals.map((meal) => (
                <div key={meal.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={meal.is_completed}
                      onChange={() => handleCompleteMeal(meal.id)}
                      className="h-4 w-4 text-primary"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-900">{meal.name}</h5>
                      <span className="text-xs text-gray-500">
                        {meal.meal_type === 'cafe_manha' ? '07:00' :
                         meal.meal_type === 'lanche_manha' ? '09:30' :
                         meal.meal_type === 'almoco' ? '12:30' :
                         meal.meal_type === 'lanche_tarde' ? '15:30' :
                         meal.meal_type === 'jantar' ? '19:00' : '21:30'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{meal.calories} kcal</p>
                  </div>
                  {meal.is_completed && (
                    <div className="text-green-500">
                      <i className="ri-check-line w-5 h-5"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <Button className="flex-1">
                Ver Detalhes
              </Button>
              <Button variant="outline" size="sm">
                <i className="ri-add-line w-4 h-4"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Resumo do Dia */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-fire-line text-primary"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Calorias Queimadas</p>
                <p className="text-2xl font-bold text-gray-900">420</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-time-line text-primary"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Tempo de Treino</p>
                <p className="text-2xl font-bold text-gray-900">45min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-drop-line text-primary"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Hidratação</p>
                <p className="text-2xl font-bold text-gray-900">2.1L</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanoDoDia;
