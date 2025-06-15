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
import { Button } from "@/components/ui/button";
import { useGenerateWorkoutPlan } from "@/hooks/useGenerateWorkoutPlan";
import { useProfile } from "@/hooks/useProfile";
import { useUserWorkoutPreferences } from "@/hooks/useUserWorkoutPreferences";
import { useToast } from "@/hooks/use-toast";
import WorkoutPreferencesHistoryTable from "@/components/workouts/WorkoutPreferencesHistoryTable";

const PlanoDoDia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [formVisible, setFormVisible] = useState(false);

  const { user } = useAuth();
  const { generate, loading: loadingGerarPlano } = useGenerateWorkoutPlan(user?.id);
  const { toast } = useToast();

  // Carregar perfil e preferências
  const { profile, loading: loadingProfile } = useProfile();
  const { prefs, loading: loadingPrefs } = useUserWorkoutPreferences(user?.id);

  // Nova flag: só permite criar treino/refeição auto se perfil e prefs existem
  const allowAutoCreate = !!profile && !!prefs;

  // Adaptação: fornecemos a flag allowAutoCreate
  const {
    workoutExercises,
    loading,
    todayWorkout,
    todayMeals,
    handleCompleteExercise,
    handleCompleteMeal,
    refetchAll
  } = usePlanoDoDiaController(selectedDate, loadingGerarPlano, refreshKey, allowAutoCreate);

  // Função do botão: reforçar bloqueio se dados obrigatórios não existirem
  const handleGeneratePlan = async () => {
    // Logs para debug detalhado
    console.log("Generate button clicked");
    console.log("user:", user);
    console.log("profile:", profile);
    console.log("prefs:", prefs);
    console.log("loadingProfile", loadingProfile, "loadingPrefs", loadingPrefs);

    if (loadingProfile || loadingPrefs) {
      toast({
        title: "Aguarde...",
        description: "Carregando dados do perfil e preferências.",
        variant: "default"
      });
      return;
    }
    if (!user || !user.id) {
      toast({
        title: "Usuário não encontrado",
        description: "Não foi possível identificar seu usuário. Faça login novamente.",
        variant: "destructive"
      });
      return;
    }
    if (!profile) {
      toast({
        title: "Complete seu perfil",
        description: "Você precisa preencher seu perfil antes de gerar um plano. Acesse 'Meu Perfil' no menu.",
        variant: "destructive"
      });
      return;
    }
    if (!prefs) {
      toast({
        title: "Complete suas preferências de treino",
        description: "Você precisa cadastrar as preferências de treino antes de gerar um plano. Role a página até a seção de 'Preferências de Treino'.",
        variant: "destructive"
      });
      return;
    }
    // Checagens extras para garantir que todos os campos estão presentes
    if (
      typeof profile.fitness_goal === "undefined" ||
      typeof prefs.experience_level === "undefined" ||
      typeof prefs.training_days_per_week === "undefined" ||
      typeof prefs.time_per_session === "undefined"
    ) {
      toast({
        title: "Dados incompletos",
        description: "Algum campo obrigatório do perfil ou preferências está faltando. Revise e salve novamente.",
        variant: "destructive"
      });
      return;
    }
    await generate(selectedDate);
    setRefreshKey(k => k + 1);
  };

  if (loading || loadingProfile || loadingPrefs) {
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
                onSave={addPreference}
                onCancel={() => setFormVisible(false)}
                loading={loadingPrefs}
              />
            )}
            <WorkoutPreferencesHistoryTable history={history} loading={loadingPrefs} />
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
