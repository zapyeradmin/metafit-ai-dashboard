
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWorkoutProgression } from '@/hooks/useWorkoutProgression';
import { useUserWorkoutPreferences } from '@/hooks/useUserWorkoutPreferences';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Trophy, Zap, ArrowRight } from 'lucide-react';

const WorkoutProgressionCard = () => {
  const { user } = useAuth();
  const { preferences, incrementWeeksCompleted } = useUserWorkoutPreferences(user?.id);
  const { 
    checkProgression, 
    updateUserProgression, 
    getCurrentStage, 
    loading: progressionLoading 
  } = useWorkoutProgression(user?.id);
  const [checking, setChecking] = useState(false);

  const currentStage = preferences?.treino_atual_id ? 
    getCurrentStage(preferences.treino_atual_id) : null;

  const progressPercentage = currentStage && preferences?.semanas_completadas_no_treino_atual ? 
    Math.min((preferences.semanas_completadas_no_treino_atual / currentStage.duracao_semanas) * 100, 100) : 0;

  const handleCheckProgression = async () => {
    if (!preferences?.treino_atual_id || !preferences?.objetivo_atual) return;

    setChecking(true);
    try {
      const status = await checkProgression(
        preferences.objetivo_atual,
        preferences.treino_atual_id,
        preferences.semanas_completadas_no_treino_atual || 0
      );

      if (status?.status === 'MUDANÇA_DE_TREINO' && status.novoTreinoId) {
        const updated = await updateUserProgression(
          status.novoTreinoId,
          preferences.objetivo_atual
        );
        if (updated) {
          // Recarregar preferências após atualização
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleCompleteWeek = async () => {
    await incrementWeeksCompleted();
    // Após completar uma semana, verificar se deve avançar
    setTimeout(handleCheckProgression, 500);
  };

  if (!preferences || !currentStage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Progressão do Treino
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure suas preferências de treino para acompanhar sua progressão.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Progressão do Treino
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{currentStage.nivel}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {preferences.objetivo_atual}
            </p>
          </div>
          <Badge variant="outline">
            {currentStage.arquivo.replace('.md', '').replace('workout_', '')}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progresso Semanal</span>
            <span>
              {preferences.semanas_completadas_no_treino_atual || 0} / {currentStage.duracao_semanas} semanas
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {currentStage.descricao && (
          <p className="text-sm text-muted-foreground">
            {currentStage.descricao}
          </p>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleCompleteWeek}
            className="flex-1"
            variant="outline"
            size="sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Completar Semana
          </Button>
          
          <Button 
            onClick={handleCheckProgression}
            disabled={checking || progressionLoading}
            size="sm"
            variant="outline"
          >
            {checking ? (
              <Zap className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Verificar
              </>
            )}
          </Button>
        </div>

        {preferences.data_inicio_treino_atual && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Iniciado em: {new Date(preferences.data_inicio_treino_atual).toLocaleDateString('pt-BR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutProgressionCard;
