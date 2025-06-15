
import { useToast } from '@/hooks/use-toast';

export function usePlanoMeals(thisDayMeals: any[], refetchMeals: () => Promise<void>) {
  const { toast } = useToast();

  const handleCompleteMeal = async (mealId: string, completeMealFn: (mealId: string) => Promise<void>) => {
    try {
      await completeMealFn(mealId);
      await refetchMeals();
    } catch (error) {
      // Erro já exibido no toast de useNutrition
    }
  };

  return {
    handleCompleteMeal
  }
}
