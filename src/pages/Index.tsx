
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { useBodyMeasurements } from '../hooks/useBodyMeasurements';
import { useWorkouts } from '../hooks/useWorkouts';
import { useNutrition } from '../hooks/useNutrition';
import { useDashboardData } from '../hooks/useDashboardData';
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
  const { stats, loading: statsLoading } = useDashboardData();

  const latestMeasurement = getLatestMeasurement();
  const todayWorkout = getTodayWorkout();
  const todayMeals = getTodayMeals();

  const isLoading = profileLoading || measurementsLoading || workoutsLoading || nutritionLoading || statsLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Get next workout from upcoming workouts (today or future, not completed)
  const getNextWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    return workouts
      .filter(w => w.date >= today && !w.is_completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || todayWorkout;
  };

  const nextWorkout = getNextWorkout();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader profile={profile} />
        <DateWeatherWidget />

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <ProgressCard profile={profile} latestMeasurement={latestMeasurement} />
          <NextWorkoutCard nextWorkout={nextWorkout} profile={profile} />
          <NutritionCard todayMeals={todayMeals} />
          <MetricsCard latestMeasurement={latestMeasurement} profile={profile} />
        </div>

        {/* Weekly Summary and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklySummarySection stats={stats} />
          </div>
          <div>
            <NotificationsSection stats={stats} />
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
