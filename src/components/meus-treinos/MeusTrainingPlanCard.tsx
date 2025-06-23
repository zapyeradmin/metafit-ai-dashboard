
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target, Users } from 'lucide-react';
import { UserWorkoutPreferences } from '@/hooks/useUserWorkoutPreferences';

interface MeusTrainingPlanCardProps {
  preferences: UserWorkoutPreferences;
}

const MeusTrainingPlanCard = ({ preferences }: MeusTrainingPlanCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressPercentage = () => {
    // Assumindo que um ciclo completo são 8 semanas
    const totalWeeks = 8;
    const completedWeeks = preferences.semanas_completadas_no_treino_atual || 0;
    return Math.min((completedWeeks / totalWeeks) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Plano de Treino Atual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Objetivo:</span>
                <Badge variant="secondary" className="capitalize">
                  {preferences.objetivo_atual || 'Não definido'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nível:</span>
                <Badge variant="outline" className="capitalize">
                  {preferences.experience_level}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Frequência:</span>
                <span className="text-sm">{preferences.training_days_per_week}x por semana</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Duração:</span>
                <span className="text-sm">{preferences.time_per_session} minutos</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium">Progresso do Ciclo:</span>
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Semanas completadas: {preferences.semanas_completadas_no_treino_atual || 0}</span>
                    <span>{getProgressPercentage().toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {preferences.data_inicio_treino_atual && (
                <div>
                  <span className="text-sm font-medium">Iniciado em:</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {formatDate(preferences.data_inicio_treino_atual)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {preferences.focus_areas && preferences.focus_areas.length > 0 && (
            <div>
              <span className="text-sm font-medium">Áreas de Foco:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.focus_areas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {preferences.available_equipment && preferences.available_equipment.length > 0 && (
            <div>
              <span className="text-sm font-medium">Equipamentos Disponíveis:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.available_equipment.map((equipment, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {equipment}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              Atualizar Plano de Treino
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeusTrainingPlanCard;
