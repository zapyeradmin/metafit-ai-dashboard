
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import type { Profile } from "@/hooks/useProfile";
import { DailyMeal } from "@/hooks/useNutrition";

// Padrões nutricionais
const PROTEIN_RANGES = {
  hypertrofia: [1.6, 2.2],
  emagrecimento: [1, 1.5],
  resistencia: [1.5, 1.7],
  manutencao: [1.2, 1.6],
};
const FAT_RANGE = [0.8, 1.2]; // g/kg
const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export function useMetabolicCalculations(meals: DailyMeal[] = []) {
  const { user } = useAuth();

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      return data as Profile;
    },
    enabled: !!user,
  });

  // Última medição corporal
  const { data: latestMeasurement } = useQuery<any>({
    queryKey: ["latestMeasurement", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("body_measurements")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const weight = useMemo(() => (
    latestMeasurement?.weight ??
    profile?.current_weight ??
    70
  ), [latestMeasurement?.weight, profile?.current_weight]);

  const height = useMemo(() => (
    profile?.height ?? 170
  ), [profile?.height]);

  // Calcular idade
  const age = useMemo(() => {
    if (!profile?.birth_date) return 30;
    const birth = new Date(profile.birth_date);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile?.birth_date]);

  const gender = useMemo(() => profile?.gender ?? "male", [profile?.gender]);
  const goal = useMemo(() => {
    if (!profile?.fitness_goal) return "manutencao";
    // Padronizar para nossos ranges
    if (profile.fitness_goal === "weight_gain") return "hypertrofia";
    if (profile.fitness_goal === "weight_loss") return "emagrecimento";
    if (profile.fitness_goal === "endurance") return "resistencia";
    return "manutencao";
  }, [profile?.fitness_goal]);
  const activity = useMemo(() => profile?.activity_level ?? "sedentary", [profile?.activity_level]);
  const activityFactor = useMemo(() => ACTIVITY_FACTORS[activity] ?? 1.2, [activity]);

  // TMB (Harris-Benedict)
  const tmb = useMemo(() => {
    if (!weight || !height || !age) return 0;
    if (gender === "male") {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    }
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }, [weight, height, age, gender]);

  // Tev
  const tev = useMemo(() => {
    let base = tmb * activityFactor;
    if (goal === "emagrecimento") base -= 500;
    else if (goal === "hypertrofia") base += 500;
    // resistência/manutenção: nada
    return Math.round(base);
  }, [tmb, activityFactor, goal]);

  // Macronutrientes — usar medias do range
  const proteinPerKg = (() => {
    if (goal === "hypertrofia")
      return (PROTEIN_RANGES.hypertrofia[0] + PROTEIN_RANGES.hypertrofia[1]) / 2;
    if (goal === "emagrecimento")
      return (PROTEIN_RANGES.emagrecimento[0] + PROTEIN_RANGES.emagrecimento[1]) / 2;
    if (goal === "resistencia")
      return (PROTEIN_RANGES.resistencia[0] + PROTEIN_RANGES.resistencia[1]) / 2;
    return (PROTEIN_RANGES.manutencao[0] + PROTEIN_RANGES.manutencao[1]) / 2;
  })();

  const proteinNeeds = useMemo(() => Math.round(weight * proteinPerKg), [weight, proteinPerKg]);
  const fatPerKg = (FAT_RANGE[0] + FAT_RANGE[1]) / 2;
  const fatNeeds = useMemo(() => Math.round(weight * fatPerKg), [weight, fatPerKg]);
  // Calorias: prot/gord/carb = 4/9/4 kcal
  const proteinKcal = proteinNeeds * 4;
  const fatKcal = fatNeeds * 9;
  const carbNeeds = useMemo(() => {
    if (!tev || !proteinKcal || !fatKcal) return 0;
    return Math.round((tev - proteinKcal - fatKcal) / 4);
  }, [tev, proteinKcal, fatKcal]);

  // Ingestão hídrica (ml)
  const waterIntakeRecommended = useMemo(() => Math.round(weight * 35), [weight]);

  // IMC
  const bmi = useMemo(() => {
    if (!weight || !height) return 0;
    const h = height / 100;
    return parseFloat((weight / (h * h)).toFixed(2));
  }, [weight, height]);

  // Peso ideal (Devine/Robinson simplificado — ajustar se desejar)
  const idealWeight = useMemo(() => {
    if (!height) return 0;
    if (gender === "male") return Math.round(52 + 0.75 * (height - 152.4));
    return Math.round(49 + 0.67 * (height - 152.4));
  }, [gender, height]);

  // Gordura corporal e massa magra
  const bodyFatPercentage = latestMeasurement?.body_fat_percentage ?? 0;
  const leanBodyMass = useMemo(() => {
    if (!weight || bodyFatPercentage == null) return 0;
    return parseFloat((weight * (1 - bodyFatPercentage / 100)).toFixed(2));
  }, [weight, bodyFatPercentage]);

  // Consumo de calorias/macros (das refeições do dia)
  const caloriesConsumed = useMemo(() => (
    meals.reduce((acc, meal) => acc + (typeof meal.calories === "number" ? meal.calories : 0), 0)
  ), [meals]);
  const totalProtein = useMemo(() => (
    meals.reduce((acc, meal) => acc + (typeof meal.protein === "number" ? meal.protein : 0), 0)
  ), [meals]);
  const totalCarbs = useMemo(() => (
    meals.reduce((acc, meal) => acc + (typeof meal.carbs === "number" ? meal.carbs : 0), 0)
  ), [meals]);
  const totalFat = useMemo(() => (
    meals.reduce((acc, meal) => acc + (typeof meal.fat === "number" ? meal.fat : 0), 0)
  ), [meals]);
  const diffCalories = useMemo(() => caloriesConsumed - tev, [caloriesConsumed, tev]);

  const metabolicData = {
    tmb,
    tev,
    proteinNeeds,
    fatNeeds,
    carbNeeds,
    waterIntakeRecommended,
    bmi,
    idealWeight,
    bodyFatPercentage,
    leanBodyMass,
    caloriesConsumed,
    totalProtein,
    totalCarbs,
    totalFat,
    diffCalories
  };

  return {
    metabolicData,
    profile,
    latestMeasurement,
    weight,
    height,
    age,
    goal,
    activity,
    isLoading: !profile || !latestMeasurement
  };
}
