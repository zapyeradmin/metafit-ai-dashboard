
import React from 'react';
import { ProgressChart } from '../ProgressChart';
import { Profile } from '../../hooks/useProfile';
import { BodyMeasurement } from '../../hooks/useBodyMeasurements';

interface ProgressCardProps {
  profile: Profile | null;
  latestMeasurement: BodyMeasurement | null;
}

const ProgressCard = ({ profile, latestMeasurement }: ProgressCardProps) => {
  const calculateProgress = () => {
    if (!profile?.goal_weight || !profile?.current_weight || !latestMeasurement?.weight) return 0;
    
    const startWeight = profile.current_weight;
    const goalWeight = profile.goal_weight;
    const currentWeight = latestMeasurement.weight;
    
    const totalToChange = Math.abs(startWeight - goalWeight);
    const currentProgress = Math.abs(startWeight - currentWeight);
    
    return Math.min(Math.round((currentProgress / totalToChange) * 100), 100);
  };

  const progressPercentage = calculateProgress();
  
  const getProgressText = () => {
    if (!profile?.goal_weight || !latestMeasurement?.weight) return 'Configure seu objetivo';
    
    const difference = profile.goal_weight - latestMeasurement.weight;
    if (difference > 0) {
      return `Faltam ${difference.toFixed(1)}kg para o objetivo`;
    } else if (difference < 0) {
      return `${Math.abs(difference).toFixed(1)}kg acima do objetivo`;
    } else {
      return 'Objetivo alcançado!';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">Progresso Geral</h3>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
          <i className="ri-line-chart-line text-primary"></i>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <div className="w-32 h-32">
          <ProgressChart />
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-gray-900">{progressPercentage}%</p>
        <p className="text-sm text-gray-600">{getProgressText()}</p>
      </div>
    </div>
  );
};

export default ProgressCard;
