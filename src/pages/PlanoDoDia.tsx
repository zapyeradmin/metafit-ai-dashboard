import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DateSelector from '@/components/plano-do-dia/DateSelector';
import WorkoutSection from '@/components/plano-do-dia/WorkoutSection';
import NutritionSection from '@/components/plano-do-dia/NutritionSection';
import DailySummary from '@/components/plano-do-dia/DailySummary';
import LoadingSpinner from '@/components/plano-do-dia/LoadingSpinner';
import MetabolicStats from '@/components/plano-do-dia/MetabolicStats';
import NutritionStats from '@/components/plano-do-dia/NutritionStats';
import { usePlanoDoDiaController } from '@/hooks/usePlanoDoDiaController';
import WorkoutPreferencesForm from "@/components/workouts/WorkoutPreferencesForm";
import { useAuth } from "@/hooks/useAuth";

const PlanoDoDia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const {
    workoutExercises,
    loading,
    todayWorkout,
    todayMeals,
    handleCompleteExercise,
    handleCompleteMeal
  } = usePlanoDoDiaController(selectedDate);
  const { user } = useAuth();

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

        {user && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Preferências de Treino</h2>
            <WorkoutPreferencesForm userId={user.id} />
          </div>
        )}

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
            <WorkoutSection 
              todayWorkout={todayWorkout}
              workoutExercises={workoutExercises}
              onCompleteExercise={handleCompleteExercise}
            />
          </TabsContent>

          <TabsContent value="alimentacao" className="space-y-6">
            <NutritionStats selectedDate={selectedDate} />
            <NutritionSection 
              todayMeals={todayMeals}
              onCompleteMeal={handleCompleteMeal}
            />
            <MetabolicStats />
          </TabsContent>
        </Tabs>

        <DailySummary />
      </div>
    </div>
  );
};

export default PlanoDoDia;
