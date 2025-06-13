
import React from 'react';
import { ProgressChart } from '../ProgressChart';

interface ProgressCardProps {
  progressPercentage: number;
}

const ProgressCard = ({ progressPercentage }: ProgressCardProps) => {
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
        <p className="text-sm text-gray-600">do objetivo alcançado</p>
      </div>
    </div>
  );
};

export default ProgressCard;
