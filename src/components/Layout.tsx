import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sucesso",
        description: "Logout realizado com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Menu principal
  const menuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', path: '/' },
    { icon: 'ri-calendar-line', label: 'Plano do Dia', path: '/plano-do-dia' },
    { icon: 'ri-line-chart-line', label: 'Meu Progresso', path: '/meu-progresso' },
    { icon: 'ri-shield-star-line', label: 'Dashboard PRO', path: '/dashboard-pro' },
    { icon: 'ri-file-list-3-line', label: 'Meus Dados', path: '/meus-dados' },
    { icon: 'ri-robot-line', label: 'Assistente IA', path: '/assistente-ia' },
    { icon: 'ri-settings-3-line', label: 'Configuração', path: '/configuracoes' },
    { icon: 'ri-user-line', label: 'Meu Perfil', path: '/meu-perfil' }
  ];

  // Apenas super admin vê o link
  if (user?.email === "marciliobarros2010@gmail.com") {
    menuItems.push({ icon: "ri-settings-3-line", label: "Administração", path: "/admin" });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AppSidebar
        profile={profile}
        getInitials={getInitials}
        handleSignOut={handleSignOut}
        menuItems={menuItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <AppTopbar
          onSidebarOpen={() => setIsSidebarOpen(true)}
          profile={profile}
          getInitials={getInitials}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        getInitials={getInitials}
        handleSignOut={handleSignOut}
        menuItems={menuItems}
        isMobile
      />
    </div>
  );
};

export default Layout;
