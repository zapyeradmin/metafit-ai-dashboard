
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DailyWorkout } from './useWorkouts';
import { DailyMeal } from './useNutrition';
import { BodyMeasurement } from './useBodyMeasurements';

export interface DashboardStats {
  totalWorkouts: number;
  completedWorkouts: number;
  totalMeals: number;
  completedMeals: number;
  weeklyProgress: {
    day: string;
    workouts: number;
    meals: number;
  }[];
  notifications: {
    id: string;
    type: 'workout' | 'meal' | 'measurement';
    message: string;
    time: string;
  }[];
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get date range for this week
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));

      // Fetch workouts data
      const { data: workouts } = await supabase
        .from('daily_workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0])
        .lte('date', weekEnd.toISOString().split('T')[0]);

      // Fetch meals data
      const { data: meals } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekStart.toISOString().split('T')[0])
        .lte('date', weekEnd.toISOString().split('T')[0]);

      // Calculate weekly progress
      const weeklyProgress = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayWorkouts = workouts?.filter(w => w.date === dateStr).length || 0;
        const dayMeals = meals?.filter(m => m.date === dateStr && m.is_completed).length || 0;
        
        weeklyProgress.push({
          day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
          workouts: dayWorkouts,
          meals: dayMeals
        });
      }

      // Generate notifications
      const notifications = [];
      
      // Check for missed workouts
      const todayStr = new Date().toISOString().split('T')[0];
      const todayWorkouts = workouts?.filter(w => w.date === todayStr && !w.is_completed);
      if (todayWorkouts && todayWorkouts.length > 0) {
        notifications.push({
          id: '1',
          type: 'workout' as const,
          message: `Você tem ${todayWorkouts.length} treino(s) pendente(s) para hoje`,
          time: '2h atrás'
        });
      }

      // Check for pending meals
      const todayMeals = meals?.filter(m => m.date === todayStr && !m.is_completed);
      if (todayMeals && todayMeals.length > 0) {
        notifications.push({
          id: '2',
          type: 'meal' as const,
          message: `${todayMeals.length} refeição(ões) pendente(s) para hoje`,
          time: '1h atrás'
        });
      }

      setStats({
        totalWorkouts: workouts?.length || 0,
        completedWorkouts: workouts?.filter(w => w.is_completed).length || 0,
        totalMeals: meals?.length || 0,
        completedMeals: meals?.filter(m => m.is_completed).length || 0,
        weeklyProgress,
        notifications
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchDashboardData };
};
