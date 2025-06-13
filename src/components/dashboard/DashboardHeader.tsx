
import React from 'react';
import { Profile } from '../../hooks/useProfile';

interface DashboardHeaderProps {
  profile: Profile | null;
}

const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">
        Olá {profile?.full_name || 'Usuário'}, bem-vindo ao seu painel de controle fitness.
      </p>
    </div>
  );
};

export default DashboardHeader;
