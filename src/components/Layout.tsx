import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 flex items-center justify-center border-b border-gray-200">
          <img
            src="/lovable-uploads/b0aaa10b-4f66-4468-86bb-c76e89ee01c9.png"
            alt="Logo MetaFit AI"
            className="h-9 object-contain"
            style={{ maxWidth: 170 }}
          />
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg ${
                  location.pathname === item.path
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  <i className={`${item.icon} ${location.pathname === item.path ? 'text-primary' : ''}`}></i>
                </div>
                <span className={location.pathname === item.path ? 'font-medium' : ''}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url || undefined} alt="Perfil" />
              <AvatarFallback>
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">
                Plano {profile?.fitness_goal || 'Fitness'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-button hover:bg-gray-200"
          >
            <i className="ri-logout-box-line w-4 h-4 mr-2"></i>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center md:hidden">
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <i className="ri-menu-line w-6 h-6"></i>
                </button>
                <img
                  src="/lovable-uploads/b0aaa10b-4f66-4468-86bb-c76e89ee01c9.png"
                  alt="Logo MetaFit AI"
                  className="ml-3 h-8 object-contain"
                  style={{ maxWidth: 130 }}
                />
              </div>
              <div className="flex-1 flex justify-end">
                <div className="ml-4 flex items-center md:ml-6">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
                    <i className="ri-notification-3-line w-6 h-6"></i>
                  </button>
                  <div className="ml-3 relative">
                    <div className="md:hidden">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt="Perfil" />
                        <AvatarFallback className="text-xs">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <img
                src="/lovable-uploads/b0aaa10b-4f66-4468-86bb-c76e89ee01c9.png"
                alt="Logo MetaFit AI"
                className="h-8 object-contain"
                style={{ maxWidth: 130 }}
              />
              <button onClick={() => setIsSidebarOpen(false)}>
                <i className="ri-close-line w-6 h-6 text-gray-500"></i>
              </button>
            </div>
            <div className="flex flex-col flex-grow p-4 overflow-y-auto">
              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      location.pathname === item.path
                        ? 'text-gray-900 bg-gray-100'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center mr-3">
                      <i className={`${item.icon} ${location.pathname === item.path ? 'text-primary' : ''}`}></i>
                    </div>
                    <span className={location.pathname === item.path ? 'font-medium' : ''}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Perfil" />
                  <AvatarFallback>
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Plano {profile?.fitness_goal || 'Fitness'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleSignOut}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-button hover:bg-gray-200"
              >
                <i className="ri-logout-box-line w-4 h-4 mr-2"></i>
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Layout;
