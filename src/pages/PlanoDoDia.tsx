
import React, { useState, useEffect } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DateSelector from '@/components/plano-do-dia/DateSelector';
import WorkoutSection from '@/components/plano-do-dia/WorkoutSection';
import NutritionSection from '@/components/plano-do-dia/NutritionSection';
import DailySummary from '@/components/plano-do-dia/DailySummary';
import LoadingSpinner from '@/components/plano-do-dia/LoadingSpinner';
import MetabolicStats from '@/components/plano-do-dia/MetabolicStats';
import NutritionStats from '@/components/plano-do-dia/NutritionStats';

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
      await fetchWorkoutExercises();
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Plano do Dia</h1>
          <p className="mt-1 text-sm text-gray-600">Organize seu treino e alimentação de hoje.</p>
        </div>

        <DateSelector 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <Tabs defaultValue="treino" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="treino">Treino</TabsTrigger>
            <TabsTrigger value="alimentacao">Alimentação</TabsTrigger>
          </TabsList>

          <TabsContent value="treino" className="space-y-6">
            <MetabolicStats />
            <WorkoutSection 
              todayWorkout={todayWorkout}
              workoutExercises={workoutExercises}
              onCompleteExercise={handleCompleteExercise}
            />
          </TabsContent>

          <TabsContent value="alimentacao" className="space-y-6">
            <NutritionStats meals={todayMeals} />
            <NutritionSection 
              todayMeals={todayMeals}
              onCompleteMeal={handleCompleteMeal}
            />
          </TabsContent>
        </Tabs>

        <DailySummary />
      </div>
    </div>
  );
};

export default PlanoDoDia;
