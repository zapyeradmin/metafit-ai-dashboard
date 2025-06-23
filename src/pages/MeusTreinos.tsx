
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserWorkoutPreferences } from '@/hooks/useUserWorkoutPreferences';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useGenerateWorkoutPlan } from '@/hooks/useGenerateWorkoutPlan';
import { Calendar, Play, Target, Clock, Dumbbell, TrendingUp } from 'lucide-react';
import LoadingSpinner from '@/components/plano-do-dia/LoadingSpinner';
import MeusTrainingPlanCard from '@/components/meus-treinos/MeusTrainingPlanCard';
import MeusWorkoutHistoryCard from '@/components/meus-treinos/MeusWorkoutHistoryCard';
import MeusWorkoutProgressCard from '@/components/meus-treinos/MeusWorkoutProgressCard';

const MeusTreinos = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { user } = useAuth();
  const { preferences, loading: prefsLoading } = useUserWorkoutPreferences(user?.id);
  const { templates, getTemplatesByGoal } = useWorkoutTemplates();
  const { generate, loading: generateLoading } = useGenerateWorkoutPlan(user?.id);

  if (prefsLoading) {
    return <LoadingSpinner />;
  }

  const handleGenerateWorkout = async () => {
    await generate(selectedDate);
  };

  const getRecommendedTemplates = () => {
    if (!preferences) return [];
    return getTemplatesByGoal(preferences.objetivo_atual || 'geral').slice(0, 3);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meus Treinos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Seus treinos personalizados baseados em suas preferências e objetivos.
          </p>
        </div>

        {!preferences ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Configure suas Preferências</h3>
              <p className="text-muted-foreground mb-4">
                Para receber treinos personalizados, você precisa configurar suas preferências primeiro.
              </p>
              <Button onClick={() => window.location.href = '/plano-do-dia'}>
                Configurar Preferências
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="atual" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="atual">Treino Atual</TabsTrigger>
              <TabsTrigger value="planos">Planos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="progresso">Progresso</TabsTrigger>
            </TabsList>

            <TabsContent value="atual" className="space-y-6">
              {/* Status do Treino Atual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Objetivo Atual</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">
                      {preferences.objetivo_atual || 'Não definido'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Nível: {preferences.experience_level}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Treinos por Semana</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {preferences.training_days_per_week}x
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {preferences.time_per_session} min por sessão
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Semanas Completas</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {preferences.semanas_completadas_no_treino_atual || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      No treino atual
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Gerador de Treino */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Gerar Treino Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm font-medium">Data do Treino</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="ml-2 px-3 py-1 border rounded-md"
                      />
                    </div>
                    <Button 
                      onClick={handleGenerateWorkout}
                      disabled={generateLoading}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {generateLoading ? 'Gerando...' : 'Gerar Treino'}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Este treino será gerado baseado em suas preferências atuais e templates do sistema.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Templates Recomendados */}
              <Card>
                <CardHeader>
                  <CardTitle>Templates Recomendados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getRecommendedTemplates().map((template) => (
                      <Card key={template.id} className="relative">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">
                                {template.template_name.replace(/_/g, ' ')}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {template.experience_level}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {template.training_days_per_week && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {template.training_days_per_week}x/sem
                                </span>
                              )}
                            </div>
                            
                            <div className="pt-2">
                              <Badge variant="outline" className="text-xs">
                                <Play className="h-3 w-3 mr-1" />
                                {template.structure?.semanas?.[0]?.dias?.length || 0} dias
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planos" className="space-y-6">
              <MeusTrainingPlanCard preferences={preferences} />
            </TabsContent>

            <TabsContent value="historico" className="space-y-6">
              <MeusWorkoutHistoryCard userId={user?.id} />
            </TabsContent>

            <TabsContent value="progresso" className="space-y-6">
              <MeusWorkoutProgressCard userId={user?.id} preferences={preferences} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MeusTreinos;
