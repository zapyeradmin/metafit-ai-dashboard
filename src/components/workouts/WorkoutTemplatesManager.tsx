
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { Download, FileText, Play } from 'lucide-react';

const WorkoutTemplatesManager = () => {
  const { 
    templates, 
    loading, 
    processTemplates,
    getTemplatesByGoal 
  } = useWorkoutTemplates();

  const handleProcessTemplates = async () => {
    try {
      await processTemplates();
    } catch (error) {
      console.error('Erro ao processar templates:', error);
    }
  };

  const goalLabels = {
    'emagrecimento': 'Emagrecimento',
    'hipertrofia': 'Hipertrofia',
    'core_mobilidade': 'Core e Mobilidade',
    'geral': 'Geral'
  };

  const levelLabels = {
    'iniciante': 'Iniciante',
    'intermediario': 'Intermediário',
    'avançado': 'Avançado',
    'elite': 'Elite'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates de Treino
            </CardTitle>
            <Button
              onClick={handleProcessTemplates}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {loading ? 'Processando...' : 'Importar Templates'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum template encontrado. Clique em "Importar Templates" para carregar os templates do storage.
                </p>
              </div>
            ) : (
              Object.entries(goalLabels).map(([goal, label]) => {
                const goalTemplates = getTemplatesByGoal(goal);
                if (goalTemplates.length === 0) return null;

                return (
                  <div key={goal} className="space-y-3">
                    <h3 className="font-semibold text-lg">{label}</h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {goalTemplates.map((template) => (
                        <Card key={template.id} className="relative">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm">
                                  {template.template_name.replace(/_/g, ' ')}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {levelLabels[template.experience_level] || template.experience_level}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {template.training_days_per_week && (
                                  <span>{template.training_days_per_week}x/semana</span>
                                )}
                                {template.focus_areas?.length > 0 && (
                                  <span>• {template.focus_areas.join(', ')}</span>
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
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutTemplatesManager;
