
import React, { useState } from 'react';

const Configuracoes = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    workoutReminders: true,
    mealReminders: true,
    theme: 'light',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo'
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelectChange = (setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-1 text-sm text-gray-600">Personalize sua experiência no MetaFit AI.</p>
        </div>

        <div className="space-y-6">
          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notificações Push</h4>
                  <p className="text-sm text-gray-600">Receba notificações no aplicativo</p>
                </div>
                <label className="custom-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
                  <p className="text-sm text-gray-600">Receba atualizações por email</p>
                </div>
                <label className="custom-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Lembretes de Treino</h4>
                  <p className="text-sm text-gray-600">Receba lembretes dos seus treinos</p>
                </div>
                <label className="custom-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.workoutReminders}
                    onChange={() => handleToggle('workoutReminders')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Lembretes de Refeição</h4>
                  <p className="text-sm text-gray-600">Receba lembretes das suas refeições</p>
                </div>
                <label className="custom-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.mealReminders}
                    onChange={() => handleToggle('mealReminders')}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Aparência */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aparência</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => handleSelectChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
            </div>
          </div>

          {/* Idioma e Região */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Idioma e Região</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select 
                  value={settings.language}
                  onChange={(e) => handleSelectChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuso Horário</label>
                <select 
                  value={settings.timezone}
                  onChange={(e) => handleSelectChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacidade e Segurança */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacidade e Segurança</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-lock-line text-gray-400 w-5 h-5 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Alterar Senha</h4>
                    <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                  Alterar
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-shield-check-line text-gray-400 w-5 h-5 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</h4>
                    <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                  Configurar
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <i className="ri-download-line text-gray-400 w-5 h-5 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Baixar Meus Dados</h4>
                    <p className="text-sm text-gray-600">Exporte todos os seus dados</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                  Baixar
                </button>
              </div>
            </div>
          </div>

          {/* Plano e Faturamento */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano e Faturamento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Plano Atual</h4>
                  <p className="text-sm text-gray-600">MetaFit AI Pro - R$ 29,90/mês</p>
                  <p className="text-xs text-gray-500">Próxima cobrança: 12/07/2025</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Gerenciar
                  </button>
                  <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de Perigo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-red-900">Deletar Conta</h4>
                  <p className="text-sm text-red-600">Esta ação não pode ser desfeita</p>
                </div>
                <button className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
                  Deletar Conta
                </button>
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button className="px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
