
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useBodyMeasurements } from '../hooks/useBodyMeasurements';
import { useWorkouts } from '../hooks/useWorkouts';
import { useNutrition } from '../hooks/useNutrition';
import LoadingSpinner from '../components/plano-do-dia/LoadingSpinner';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DateWeatherWidget from '../components/dashboard/DateWeatherWidget';
import ProgressCard from '../components/dashboard/ProgressCard';
import NextWorkoutCard from '../components/dashboard/NextWorkoutCard';
import NutritionCard from '../components/dashboard/NutritionCard';
import MetricsCard from '../components/dashboard/MetricsCard';
import WeeklySummarySection from '../components/dashboard/WeeklySummarySection';
import NotificationsSection from '../components/dashboard/NotificationsSection';
import UpcomingWorkoutsSection from '../components/dashboard/UpcomingWorkoutsSection';
import NutritionTipsSection from '../components/dashboard/NutritionTipsSection';

const Index = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { getLatestMeasurement, loading: measurementsLoading } = useBodyMeasurements();
  const { getTodayWorkout, workouts, loading: workoutsLoading } = useWorkouts();
  const { getTodayMeals, loading: nutritionLoading } = useNutrition();

  const latestMeasurement = getLatestMeasurement();
  const todayWorkout = getTodayWorkout();
  const todayMeals = getTodayMeals();

  const isLoading = profileLoading || measurementsLoading || workoutsLoading || nutritionLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Calculate progress percentage based on current vs goal weight
  const calculateProgress = () => {
    if (!profile?.goal_weight || !latestMeasurement?.weight || !profile?.current_weight) return 0;
    const totalToLose = Math.abs(profile.current_weight - profile.goal_weight);
    const currentProgress = Math.abs(profile.current_weight - latestMeasurement.weight);
    return Math.min(Math.round((currentProgress / totalToLose) * 100), 100);
  };

  const progressPercentage = calculateProgress();

  // Get next workout from upcoming workouts
  const getNextWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return workouts.find(w => w.date >= today && !w.is_completed) || todayWorkout;
  };

  const nextWorkout = getNextWorkout();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader profile={profile} />
        <DateWeatherWidget />

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <ProgressCard progressPercentage={progressPercentage} />
          <NextWorkoutCard nextWorkout={nextWorkout} profile={profile} />
          <NutritionCard todayMeals={todayMeals} />
          <MetricsCard latestMeasurement={latestMeasurement} progressPercentage={progressPercentage} />
        </div>

        {/* Weekly Summary and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklySummarySection />
          </div>
          <div>
            <NotificationsSection />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <UpcomingWorkoutsSection workouts={workouts} profile={profile} />
          <NutritionTipsSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
