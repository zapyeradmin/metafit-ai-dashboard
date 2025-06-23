
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import LoadingSpinner from '@/components/plano-do-dia/LoadingSpinner';

interface MeusWorkoutHistoryCardProps {
  userId?: string;
}

const MeusWorkoutHistoryCard = ({ userId }: MeusWorkoutHistoryCardProps) => {
  const { workouts, loading } = useWorkouts();

  if (loading) {
    return <LoadingSpinner />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const completedWorkouts = workouts.filter(w => w.is_completed);
  const pendingWorkouts = workouts.filter(w => !w.is_completed);

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedWorkouts.length}</p>
                <p className="text-sm text-muted-foreground">Treinos Completos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{pendingWorkouts.length}</p>
                <p className="text-sm text-muted-foreground">Treinos Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{workouts.length}</p>
                <p className="text-sm text-muted-foreground">Total de Treinos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Treinos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workouts.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum treino encontrado</p>
              </div>
            ) : (
              workouts.slice(0, 10).map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {workout.is_completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(workout.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {workout.muscle_groups?.map((group, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                    
                    {workout.duration_minutes && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {workout.duration_minutes}min
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeusWorkoutHistoryCard;
