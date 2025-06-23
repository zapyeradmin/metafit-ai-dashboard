
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { UserWorkoutPreferences } from '@/hooks/useUserWorkoutPreferences';
import { useWorkoutProgression } from '@/hooks/useWorkoutProgression';

interface MeusWorkoutProgressCardProps {
  userId?: string;
  preferences: UserWorkoutPreferences;
}

const MeusWorkoutProgressCard = ({ userId, preferences }: MeusWorkoutProgressCardProps) => {
  const { checkProgression, loading } = useWorkoutProgression(userId);

  const handleCheckProgression = async () => {
    if (!preferences.treino_atual_id || !preferences.objetivo_atual) return;
    
    await checkProgression(
      preferences.objetivo_atual,
      preferences.treino_atual_id,
      preferences.semanas_completadas_no_treino_atual || 0
    );
  };

  const getProgressLevel = () => {
    const weeks = preferences.semanas_completadas_no_treino_atual || 0;
    if (weeks >= 8) return 'Avançado';
    if (weeks >= 4) return 'Intermediário';
    return 'Iniciante';
  };

  const getNextMilestone = () => {
    const weeks = preferences.semanas_completadas_no_treino_atual || 0;
    if (weeks < 4) return { weeks: 4, title: 'Primeiro Mês' };
    if (weeks < 8) return { weeks: 8, title: 'Ciclo Completo' };
    return { weeks: 12, title: 'Próximo Nível' };
  };

  const nextMilestone = getNextMilestone();
  const progressToNext = ((preferences.semanas_completadas_no_treino_atual || 0) / nextMilestone.weeks) * 100;

  return (
    <div className="space-y-6">
      {/* Progresso Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso do Treino
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {preferences.semanas_completadas_no_treino_atual || 0}
              </div>
              <div className="text-sm text-muted-foreground">Semanas Completas</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {getProgressLevel()}
              </div>
              <div className="text-sm text-muted-foreground">Nível Atual</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Math.max(0, nextMilestone.weeks - (preferences.semanas_completadas_no_treino_atual || 0))}
              </div>
              <div className="text-sm text-muted-foreground">Semanas até {nextMilestone.title}</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso para {nextMilestone.title}</span>
              <span>{Math.min(progressToNext, 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verificador de Progressão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Verificar Progressão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Verifique se é hora de avançar para o próximo nível do seu treino baseado no seu progresso atual.
          </p>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleCheckProgression}
              disabled={loading || !preferences.treino_atual_id}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              {loading ? 'Verificando...' : 'Verificar Progressão'}
            </Button>
            
            {!preferences.treino_atual_id && (
              <Badge variant="secondary">
                Configure um treino primeiro
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas e Marcos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${(preferences.semanas_completadas_no_treino_atual || 0) >= 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Award className={`h-5 w-5 ${(preferences.semanas_completadas_no_treino_atual || 0) >= 1 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium">Primeira Semana</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Complete sua primeira semana de treino</p>
            </div>
            
            <div className={`p-4 rounded-lg border ${(preferences.semanas_completadas_no_treino_atual || 0) >= 4 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Award className={`h-5 w-5 ${(preferences.semanas_completadas_no_treino_atual || 0) >= 4 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium">Primeiro Mês</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Complete 4 semanas consecutivas</p>
            </div>
            
            <div className={`p-4 rounded-lg border ${(preferences.semanas_completadas_no_treino_atual || 0) >= 8 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Award className={`h-5 w-5 ${(preferences.semanas_completadas_no_treino_atual || 0) >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium">Ciclo Completo</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Complete um ciclo de 8 semanas</p>
            </div>
            
            <div className={`p-4 rounded-lg border ${(preferences.semanas_completadas_no_treino_atual || 0) >= 12 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Award className={`h-5 w-5 ${(preferences.semanas_completadas_no_treino_atual || 0) >= 12 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="font-medium">Veterano</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Complete 12 semanas de treino</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeusWorkoutProgressCard;
