import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

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

  const { data: profile, isLoading: isProfileLoading } = useQuery(
    ["profile"],
    async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data;
    },
    {
      enabled: !!user,
    }
  );

  const { data: latestMeasurement, isLoading: isMeasurementLoading } = useQuery(
    ["latestMeasurement"],
    async () => {
      const { data, error } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching latest measurement:", error);
        return null;
      }

      return data;
    },
    {
      enabled: !!user,
    }
  );

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

  // Cálculo exemplo ajustando TMB usando health data
  function getTMB() {
    const baseTMB =
      profile?.gender === "male"
        ? 88.362 + 13.397 * (latestMeasurement?.weight || 0) + 4.799 * (profile?.height || 0) - 5.677 * (age || 0)
        : 447.593 + 9.247 * (latestMeasurement?.weight || 0) + 3.098 * (profile?.height || 0) - 4.330 * (age || 0);
    return adjustTMBForHealthData(baseTMB, healthData);
  }

  function calculateBMI() {
    if (!latestMeasurement?.weight || !profile?.height) return null;

    const heightInMeters = profile.height / 100;
    const bmi = latestMeasurement.weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2));
  }

  function getRecommendedDailyCalories() {
    const bmi = calculateBMI();
    if (!bmi || !profile?.activity_level) return null;

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

  return {
    getTMB,
    calculateBMI,
    getRecommendedDailyCalories,
    profile,
    latestMeasurement,
    isProfileLoading,
    isMeasurementLoading,
    healthData,
  };
}
