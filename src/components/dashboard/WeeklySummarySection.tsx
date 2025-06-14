
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '../../hooks/useDashboardData';

interface WeeklySummarySectionProps {
  stats: DashboardStats | null;
}

const WeeklySummarySection = ({ stats }: WeeklySummarySectionProps) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Resumo Semanal</h3>
        </div>
        <div className="h-72 flex items-center justify-center">
          <p className="text-gray-500">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Resumo Semanal</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-gray-600">Treinos</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Refeições</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.weeklyProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="workouts" fill="#8884d8" name="Treinos" />
            <Bar dataKey="meals" fill="#82ca9d" name="Refeições" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.completedWorkouts}/{stats.totalWorkouts}</p>
          <p className="text-sm text-gray-600">Treinos Concluídos</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.completedMeals}/{stats.totalMeals}</p>
          <p className="text-sm text-gray-600">Refeições Concluídas</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummarySection;
