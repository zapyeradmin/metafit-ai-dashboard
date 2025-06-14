
import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { useBodyMeasurements } from './useBodyMeasurements';

export interface MetabolicData {
  bmr: number; // Taxa Metabólica Basal
  tev: number; // Valor Energético Total
  dailyWorkoutCalories: number; // Gasto Calórico Diário por Treino
  totalCaloriesBurned: number; // Gasto Calórico Total
}

export const useMetabolicCalculations = () => {
  const { profile } = useProfile();
  const { measurements } = useBodyMeasurements();
  const [metabolicData, setMetabolicData] = useState<MetabolicData>({
    bmr: 0,
    tev: 0,
    dailyWorkoutCalories: 0,
    totalCaloriesBurned: 0
  });

  useEffect(() => {
    if (profile && measurements.length > 0) {
      calculateMetabolicData();
    }
  }, [profile, measurements]);

  const calculateMetabolicData = () => {
    if (!profile) return;

    const latestMeasurement = measurements[0];
    const weight = latestMeasurement?.weight || profile.current_weight || 70;
    const height = profile.height || 170;
    const birthDate = profile.birth_date ? new Date(profile.birth_date) : new Date('1990-01-01');
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const gender = profile.gender || 'male';

    // Cálculo da Taxa Metabólica Basal (BMR) usando fórmula de Harris-Benedict
    let bmr: number;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Valor Energético Total (TEV) baseado no nível de atividade
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };

    const activityLevel = profile.activity_level || 'moderate';
    const tev = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55);

    // Gasto Calórico Diário por Treino (estimativa baseada no peso e intensidade)
    const dailyWorkoutCalories = weight * 8; // Aproximadamente 8 cal/kg para treino moderado

    // Gasto Calórico Total
    const totalCaloriesBurned = tev + dailyWorkoutCalories;

    setMetabolicData({
      bmr: Math.round(bmr),
      tev: Math.round(tev),
      dailyWorkoutCalories: Math.round(dailyWorkoutCalories),
      totalCaloriesBurned: Math.round(totalCaloriesBurned)
    });
  };

  return { metabolicData };
};
