
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DateSelector from '@/components/plano-do-dia/DateSelector';
import WorkoutSection from '@/components/plano-do-dia/WorkoutSection';
import NutritionSection from '@/components/plano-do-dia/NutritionSection';
import DailySummary from '@/components/plano-do-dia/DailySummary';
import LoadingSpinner from '@/components/plano-do-dia/LoadingSpinner';
import MetabolicStats from '@/components/plano-do-dia/MetabolicStats';
import NutritionStats from '@/components/plano-do-dia/NutritionStats';
import WorkoutProgressionCard from '@/components/workouts/WorkoutProgressionCard';
import { usePlanoDoDiaController } from '@/hooks/usePlanoDoDiaController';
import WorkoutPreferencesForm from "@/components/workouts/WorkoutPreferencesForm";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserWorkoutPreferences } from "@/hooks/useUserWorkoutPreferences";
import { useToast } from "@/hooks/use-toast";
import WorkoutPreferencesHistoryTable from "@/components/workouts/WorkoutPreferencesHistoryTable";
import NutritionPreferencesForm from "@/components/nutrition/NutritionPreferencesForm";
import NutritionPreferencesHistoryTable from "@/components/nutrition/NutritionPreferencesHistoryTable";
import { useUserNutritionPreferences } from "@/hooks/useUserNutritionPreferences";

const PlanoDoDia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formVisible, setFormVisible] = useState(false);
  const [nutritionFormVisible, setNutritionFormVisible] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar perfil e preferências
  const { profile, loading: loadingProfile } = useProfile();
  const { history, addPreference, loading: loadingPrefs } = useUserWorkoutPreferences(user?.id);
  const { history: nutritionHistory, addPreference: addNutritionPref, loading: loadingNutritionPrefs } = useUserNutritionPreferences(user?.id);

  // Nova flag: só permite criar treino/refeição auto se perfil e prefs existem
  const allowAutoCreate = !!profile && history && history.length > 0;

  const {
    workoutExercises,
    loading,
    todayWorkout,
    todayMeals,
    handleCompleteExercise,
    handleCompleteMeal,
    refetchAll
  } = usePlanoDoDiaController(selectedDate, false, refreshKey, allowAutoCreate);

  if (loading || loadingProfile || loadingPrefs || loadingNutritionPrefs) {
    return <LoadingSpinner />;
  }

  // Adiciona verificação e mensagens para dados faltantes/erro
  if (!todayWorkout) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-4 rounded">
          Nenhum treino encontrado ou ocorreu um erro ao carregar o treino de hoje.
        </div>
      </div>
    );
  }

  if (!todayMeals || todayMeals.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 p-4 rounded">
          Nenhuma refeição encontrada ou ocorreu um erro ao carregar as refeições de hoje.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plano do Dia</h1>
            <p className="mt-1 text-sm text-gray-600">Organize seu treino e alimentação de hoje.</p>
          </div>
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
            {/* Novo componente de progressão */}
            <WorkoutProgressionCard />

            {user && (
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg font-bold">Preferências de Treino</h2>
                  {!formVisible && (
                    <button
                      className="bg-blue-600 text-white rounded px-4 py-2"
                      onClick={() => setFormVisible(true)}
                    >
                      Criar Nova Preferência
                    </button>
                  )}
                </div>
                {formVisible && (
                  <WorkoutPreferencesForm
                    onSave={async (data) => {
                      const ok = await addPreference(data);
                      if (ok) setFormVisible(false);
                      return ok;
                    }}
                    onCancel={() => setFormVisible(false)}
                    loading={loadingPrefs}
                  />
                )}
                <WorkoutPreferencesHistoryTable history={history || []} loading={loadingPrefs} />
              </div>
            )}
            <WorkoutSection 
              todayWorkout={todayWorkout}
              workoutExercises={workoutExercises}
              onCompleteExercise={handleCompleteExercise}
            />
          </TabsContent>

          <TabsContent value="alimentacao" className="space-y-6">
            {user && (
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg font-bold">Preferências de Alimentação</h2>
                  {!nutritionFormVisible && (
                    <button
                      className="bg-blue-600 text-white rounded px-4 py-2"
                      onClick={() => setNutritionFormVisible(true)}
                    >
                      Criar Nova Preferência
                    </button>
                  )}
                </div>
                {nutritionFormVisible && (
                  <NutritionPreferencesForm
                    onSave={async (data) => {
                      const ok = await addNutritionPref(data);
                      if (ok) setNutritionFormVisible(false);
                      return ok;
                    }}
                    onCancel={() => setNutritionFormVisible(false)}
                    loading={loadingNutritionPrefs}
                  />
                )}
                <NutritionPreferencesHistoryTable history={nutritionHistory || []} loading={loadingNutritionPrefs} />
              </div>
            )}
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
