
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAvatar } from '@/hooks/useAvatar';
import { useAuth } from '@/hooks/useAuth';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  fullName?: string | null;
  onAvatarUpdate?: (url: string) => void;
}

const AvatarUpload = ({ currentAvatar, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, uploading } = useAvatar();
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const url = await uploadAvatar(file, user.id);
      onAvatarUpdate?.(url);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="w-20 h-20">
        <AvatarImage src={currentAvatar || undefined} alt="Perfil" />
        <AvatarFallback className="text-lg">
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {fullName || 'Usuário'}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={handleUploadClick}
          disabled={uploading}
        >
          {uploading ? 'Enviando...' : 'Alterar Foto'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default AvatarUpload;
