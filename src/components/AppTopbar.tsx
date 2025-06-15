
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AppTopbarProps {
  onSidebarOpen: () => void;
  profile: any;
  getInitials: (name?: string | null) => string;
}

const AppTopbar: React.FC<AppTopbarProps> = ({ onSidebarOpen, profile, getInitials }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={onSidebarOpen}
            >
              <i className="ri-menu-line w-6 h-6"></i>
            </button>
            <img
              src="/lovable-uploads/b0aaa10b-4f66-4468-86bb-c76e89ee01c9.png"
              alt="Logo MetaFit AI"
              className="ml-3 h-[59px] object-contain"
              style={{ maxWidth: 240 }}
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
  );
};

export default AppTopbar;
