
import React from 'react';
import { Profile } from '../../hooks/useProfile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  profile: Profile | null;
}

const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mb-6 flex items-center space-x-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={profile?.avatar_url || undefined} alt="Perfil" />
        <AvatarFallback className="text-lg">
          {getInitials(profile?.full_name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Olá {profile?.full_name || 'Usuário'}, bem-vindo ao seu painel de controle fitness.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
