
import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { useBodyMeasurements } from './useBodyMeasurements';
import { usePhysicalData } from './usePhysicalData';

export interface MetabolicData {
  bmr: number; // Taxa Metabólica Basal
  tev: number; // Valor Energético Total
  dailyWorkoutCalories: number; // Gasto Calórico Diário por Treino
  totalCaloriesBurned: number; // Gasto Calórico Total
  bodyFatPercentage: number; // Percentual de Gordura Corporal
  leanBodyMass: number; // Massa Corporal Magra
  idealWeight: number; // Peso Ideal
  bmi: number; // Índice de Massa Corporal
  waterIntakeRecommended: number; // Ingestão de Água Recomendada
  proteinNeeds: number; // Necessidades de Proteína
  carbNeeds: number; // Necessidades de Carboidratos
  fatNeeds: number; // Necessidades de Gordura
}

export const useMetabolicCalculations = () => {
  const { profile } = useProfile();
  const { measurements } = useBodyMeasurements();
  const { physicalData } = usePhysicalData();
  const [metabolicData, setMetabolicData] = useState<MetabolicData>({
    bmr: 0,
    tev: 0,
    dailyWorkoutCalories: 0,
    totalCaloriesBurned: 0,
    bodyFatPercentage: 0,
    leanBodyMass: 0,
    idealWeight: 0,
    bmi: 0,
    waterIntakeRecommended: 0,
    proteinNeeds: 0,
    carbNeeds: 0,
    fatNeeds: 0
  });

  useEffect(() => {
    if (profile) {
      calculateMetabolicData();
    }
  }, [profile, measurements, physicalData]);

  const calculateMetabolicData = () => {
    if (!profile) return;

    const latestMeasurement = measurements.length > 0 ? measurements[0] : null;
    const weight = latestMeasurement?.weight || profile.current_weight || 70;
    const height = profile.height || 170;
    const birthDate = profile.birth_date ? new Date(profile.birth_date) : new Date('1990-01-01');
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const gender = profile.gender || 'male';

    // Cálculo da Taxa Metabólica Basal (BMR) usando fórmula de Mifflin-St Jeor (mais precisa)
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Ajuste do BMR baseado no tipo de metabolismo
    if (physicalData?.metabolism_type) {
      switch (physicalData.metabolism_type) {
        case 'lento':
          bmr *= 0.9;
          break;
        case 'acelerado':
          bmr *= 1.1;
          break;
        default:
          break;
      }
    }

    // Valor Energético Total (TEV) baseado no nível de atividade e dados específicos
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };

    let activityLevel = profile.activity_level || 'moderate';
    let activityMultiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55;

    // Ajuste baseado na frequência de treino real
    if (physicalData?.training_frequency) {
      if (physicalData.training_frequency >= 6) {
        activityMultiplier = Math.max(activityMultiplier, 1.9);
      } else if (physicalData.training_frequency >= 4) {
        activityMultiplier = Math.max(activityMultiplier, 1.725);
      } else if (physicalData.training_frequency >= 3) {
        activityMultiplier = Math.max(activityMultiplier, 1.55);
      }
    }

    const tev = bmr * activityMultiplier;

    // Gasto Calórico Diário por Treino baseado em dados reais
    let dailyWorkoutCalories = weight * 8; // Base
    
    if (physicalData?.training_experience) {
      switch (physicalData.training_experience) {
        case 'iniciante':
          dailyWorkoutCalories *= 0.8;
          break;
        case 'intermediario':
          dailyWorkoutCalories *= 1.0;
          break;
        case 'avancado':
          dailyWorkoutCalories *= 1.2;
          break;
        case 'expert':
          dailyWorkoutCalories *= 1.4;
          break;
      }
    }

    // Cálculo do percentual de gordura corporal usando circunferências
    let bodyFatPercentage = latestMeasurement?.body_fat_percentage || 0;
    
    if (!bodyFatPercentage && physicalData?.neck_circumference && latestMeasurement?.waist) {
      // Fórmula da Marinha Americana para homens
      if (gender === 'male') {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(latestMeasurement.waist) + 0.15456 * Math.log10(physicalData.neck_circumference)) - 450;
      } else {
        // Para mulheres, inclui circunferência do quadril
        const hips = latestMeasurement?.hips || 90;
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(latestMeasurement.waist) + 0.22100 * Math.log10(hips) - 0.35004 * Math.log10(physicalData.neck_circumference)) - 450;
      }
    }

    // Massa Corporal Magra
    const leanBodyMass = weight * (1 - bodyFatPercentage / 100);

    // Peso Ideal usando fórmula de Robinson
    let idealWeight: number;
    if (gender === 'male') {
      idealWeight = 52 + 1.9 * ((height / 2.54) - 60);
    } else {
      idealWeight = 49 + 1.7 * ((height / 2.54) - 60);
    }

    // IMC
    const bmi = weight / Math.pow(height / 100, 2);

    // Ingestão de Água Recomendada (ml)
    let waterIntakeRecommended = weight * 35; // Base: 35ml por kg
    if (physicalData?.training_frequency && physicalData.training_frequency > 3) {
      waterIntakeRecommended += 500; // Adicional para treinos intensos
    }

    // Necessidades de Macronutrientes baseadas no objetivo e dados físicos
    const proteinNeeds = leanBodyMass * 2.2; // 2.2g por kg de massa magra
    
    let carbMultiplier = 4; // Base para manutenção
    if (profile.fitness_goal === 'lose_weight') {
      carbMultiplier = 2;
    } else if (profile.fitness_goal === 'gain_muscle') {
      carbMultiplier = 6;
    }
    
    const carbNeeds = weight * carbMultiplier;
    const fatNeeds = weight * 0.8; // 0.8g por kg de peso corporal

    const totalCaloriesBurned = tev;

    setMetabolicData({
      bmr: Math.round(bmr),
      tev: Math.round(tev),
      dailyWorkoutCalories: Math.round(dailyWorkoutCalories),
      totalCaloriesBurned: Math.round(totalCaloriesBurned),
      bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
      leanBodyMass: Math.round(leanBodyMass * 10) / 10,
      idealWeight: Math.round(idealWeight * 10) / 10,
      bmi: Math.round(bmi * 10) / 10,
      waterIntakeRecommended: Math.round(waterIntakeRecommended),
      proteinNeeds: Math.round(proteinNeeds),
      carbNeeds: Math.round(carbNeeds),
      fatNeeds: Math.round(fatNeeds)
    });
  };

  return { metabolicData };
};
