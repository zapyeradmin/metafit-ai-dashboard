
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  profile: any;
  getInitials: (name?: string | null) => string;
  handleSignOut: () => void;
  menuItems: { icon: string; label: string; path: string }[];
  isMobile?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onClose,
  profile,
  getInitials,
  handleSignOut,
  menuItems,
  isMobile
}) => {
  const location = useLocation();

  const SidebarContent = (
    <>
      <div className="p-4 flex items-center justify-center border-b border-gray-200">
        <img
          src="/lovable-uploads/b0aaa10b-4f66-4468-86bb-c76e89ee01c9.png"
          alt="Logo MetaFit AI"
          // 15% bigger, partindo dos valores do último diff:
          className={isMobile ? "h-[59px] object-contain ml-3" : "h-[66px] object-contain"}
          style={{ maxWidth: isMobile ? 240 : 314 }}
        />
        {isMobile && onClose && (
          <button onClick={onClose} className="ml-auto">
            <i className="ri-close-line w-6 h-6 text-gray-500"></i>
          </button>
        )}
      </div>
      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
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
    </>
  );

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        {SidebarContent}
      </aside>
    )
  }

  // Mobile Sidebar Overlay
  if (isMobile && isOpen) {
    return (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200">
          {SidebarContent}
        </aside>
      </div>
    )
  }

  return null;
};

export default AppSidebar;
