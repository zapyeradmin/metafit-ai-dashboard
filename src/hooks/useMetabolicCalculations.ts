
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import type { Profile } from "@/hooks/useProfile";

// Interface para medição corporal
interface BodyMeasurement {
  id: string;
  user_id: string;
  date: string;
  weight?: number | null;
  waist?: number | null;
  chest?: number | null;
  arms?: number | null;
  thighs?: number | null;
  hips?: number | null;
  muscle_mass?: number | null;
  body_fat_percentage?: number | null;
  notes?: string | null;
  created_at?: string;
}

// Função auxiliar exemplo para ajuste
function adjustTMBForHealthData(baseTMB: number, healthData: any) {
  // Exemplo: Se usuário toma medicamento que afeta exercício, sugerir pequena redução de 5%
  if (healthData?.medication_affects_exercise === "Sim") {
    return baseTMB * 0.95;
  }
  // Exemplo: Se possui limitação física, pode reduzir atividade física recomendada
  // (Aqui fica aberto para mais regras)
  return baseTMB;
}

export function useMetabolicCalculations() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);

  // Busca o health data mais recente desse usuário
  useEffect(() => {
    async function fetchLatestHealthData() {
      if (!user) {
        setHealthData(null);
        return;
      }
      const { data } = await supabase
        .from("user_health_data")
        .select("*")
        .eq("user_id", user.id)
        .order("data_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      setHealthData(data);
    }
    fetchLatestHealthData();
  }, [user]);

  // Buscar perfil do usuário
  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile | null>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      return data as Profile;
    },
    enabled: !!user,
  });

  // Buscar última medição corporal
  const { data: latestMeasurement, isLoading: isMeasurementLoading } = useQuery<BodyMeasurement | null>({
    queryKey: ["latestMeasurement", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("Error fetching latest measurement:", error);
        return null;
      }
      return data as BodyMeasurement;
    },
    enabled: !!user,
  });

  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (profile?.birth_date) {
      const birthDate = new Date(profile.birth_date);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (
        month < 0 ||
        (month === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [profile?.birth_date]);

  // Cálculo TMB ajustando com health data
  function getTMB() {
    if (!profile || !latestMeasurement || !age) return null;
    let baseTMB = 0;
    if (profile.gender === "male") {
      baseTMB =
        88.362 +
        13.397 * (latestMeasurement.weight || 0) +
        4.799 * (profile.height || 0) -
        5.677 * age;
    } else {
      baseTMB =
        447.593 +
        9.247 * (latestMeasurement.weight || 0) +
        3.098 * (profile.height || 0) -
        4.33 * age;
    }
    return adjustTMBForHealthData(baseTMB, healthData);
  }

  function calculateBMI() {
    if (
      !latestMeasurement ||
      !latestMeasurement.weight ||
      !profile ||
      !profile.height
    )
      return null;

    const heightInMeters = profile.height / 100;
    const bmi = latestMeasurement.weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2));
  }

  function getRecommendedDailyCalories() {
    const bmi = calculateBMI();
    if (!bmi || !profile || !profile.activity_level) return null;

    let activityFactor;

    switch (profile.activity_level) {
      case "sedentary":
        activityFactor = 1.2;
        break;
      case "lightly_active":
        activityFactor = 1.375;
        break;
      case "moderately_active":
        activityFactor = 1.55;
        break;
      case "very_active":
        activityFactor = 1.725;
        break;
      case "extra_active":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    const tmb = getTMB();
    if (!tmb) return null;

    let recommendedCalories = tmb * activityFactor;

    if (profile.fitness_goal === "weight_loss") {
      recommendedCalories -= 500;
    } else if (profile.fitness_goal === "weight_gain") {
      recommendedCalories += 500;
    }

    return parseFloat(recommendedCalories.toFixed(2));
  }

  // Calcular outras métricas (valores de exemplos fictícios, use as fórmulas corretas no futuro!)
  const tmb = getTMB();
  const bmi = calculateBMI();
  const tev = getRecommendedDailyCalories();

  // Cálculos adicionais (ajustar conforme o objetivo real)
  const bodyFatPerc = latestMeasurement?.body_fat_percentage || null;
  const leanBodyMass =
    latestMeasurement && latestMeasurement.weight && bodyFatPerc != null
      ? parseFloat(
          (
            latestMeasurement.weight *
            (1 - (bodyFatPerc as number) / 100)
          ).toFixed(2)
        )
      : null;

  // Exemplo de ingestão recomendada de macro
  const proteinNeeds =
    latestMeasurement?.weight && profile?.fitness_goal === "weight_gain"
      ? Math.round(latestMeasurement.weight * 2)
      : latestMeasurement?.weight
      ? Math.round(latestMeasurement.weight * 1.5)
      : null;
  const fatNeeds =
    tev && tev > 0 ? Math.round((tev * 0.3) / 9) : null;
  const carbNeeds =
    tev && proteinNeeds && fatNeeds
      ? Math.round(
          (tev -
            proteinNeeds * 4 -
            fatNeeds * 9) /
            4
        )
      : null;

  // Recomenda ingestão diária de água como regra básica 35ml/kg de peso
  const waterIntakeRecommended =
    latestMeasurement?.weight
      ? Math.round(latestMeasurement.weight * 35)
      : null;

  // Peso ideal (exemplo simples pela altura, ajuste fórmula conforme necessário)
  const idealWeight =
    profile?.height && profile?.gender === "male"
      ? Math.round(52 + 0.75 * (profile.height - 152.4))
      : profile?.height && profile?.gender === "female"
      ? Math.round(49 + 0.67 * (profile.height - 152.4))
      : null;

  // Gasto calórico por treino (exemplo fictício)
  const dailyWorkoutCalories = profile?.activity_level
    ? Math.round(tev ? tev * 0.1 : 200)
    : null;
  const totalCaloriesBurned =
    tmb && dailyWorkoutCalories ? Math.round(tmb + dailyWorkoutCalories) : null;

  const metabolicData = {
    bmr: tmb ?? '-',
    tev: tev ?? '-',
    bmi: bmi ?? '-',
    bodyFatPercentage: bodyFatPerc ?? '-',
    leanBodyMass: leanBodyMass ?? '-',
    proteinNeeds: proteinNeeds ?? '-',
    fatNeeds: fatNeeds ?? '-',
    carbNeeds: carbNeeds ?? '-',
    waterIntakeRecommended: waterIntakeRecommended ?? '-',
    idealWeight: idealWeight ?? '-',
    dailyWorkoutCalories: dailyWorkoutCalories ?? '-',
    totalCaloriesBurned: totalCaloriesBurned ?? '-',
  };

  return {
    getTMB,
    calculateBMI,
    getRecommendedDailyCalories,
    profile,
    latestMeasurement,
    isProfileLoading,
    isMeasurementLoading,
    healthData,
    metabolicData,
  };
}

