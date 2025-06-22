
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkoutTemplate {
  id: string;
  template_name: string;
  goal: string;
  experience_level: string;
  training_days_per_week: number | null;
  focus_areas: string[];
  structure: any;
  created_at: string;
}

export function useWorkoutTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_templates')
        .select('*')
        .order('goal, experience_level');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast({
        title: 'Erro ao carregar templates',
        description: 'Não foi possível carregar os templates de treino.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const processTemplates = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('process-workout-templates');
      
      if (error) throw error;
      
      toast({
        title: 'Templates processados!',
        description: `${data.templatesProcessed} templates foram importados com sucesso.`,
      });
      
      // Recarregar templates
      await loadTemplates();
      
      return data;
    } catch (error) {
      console.error('Erro ao processar templates:', error);
      toast({
        title: 'Erro ao processar templates',
        description: 'Não foi possível importar os templates do storage.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTemplatesByGoal = (goal: string) => {
    return templates.filter(t => t.goal === goal);
  };

  const getTemplateByName = (name: string) => {
    return templates.find(t => t.template_name === name);
  };

  return {
    templates,
    loading,
    processTemplates,
    getTemplatesByGoal,
    getTemplateByName,
    refetch: loadTemplates
  };
}
