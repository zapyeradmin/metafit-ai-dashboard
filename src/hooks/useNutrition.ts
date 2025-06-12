
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DailyMeal {
  id: string;
  user_id: string;
  nutrition_plan_id: string | null;
  date: string;
  meal_type: string;
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  is_completed: boolean;
  notes: string | null;
  created_at: string;
}

export const useNutrition = () => {
  const [meals, setMeals] = useState<DailyMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching meals:', error);
        return;
      }

      setMeals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayMeals = () => {
    const today = new Date().toISOString().split('T')[0];
    return meals.filter(m => m.date === today);
  };

  const completeMeal = async (mealId: string) => {
    try {
      const { error } = await supabase
        .from('daily_meals')
        .update({ is_completed: true })
        .eq('id', mealId);

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao marcar refeição",
          variant: "destructive"
        });
        return;
      }

      fetchMeals();
      toast({
        title: "Sucesso",
        description: "Refeição marcada como concluída!"
      });
    } catch (error) {
      console.error('Error completing meal:', error);
    }
  };

  return { meals, loading, getTodayMeals, completeMeal, refetch: fetchMeals };
};
