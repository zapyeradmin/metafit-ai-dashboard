
import React from 'react';
import { Button } from "@/components/ui/button";
import AIIntegrationSection from "@/components/settings/AIIntegrationSection";
import AIUserContextsSection from "@/components/settings/AIUserContextsSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import LocaleSection from "@/components/settings/LocaleSection";
import PrivacySection from "@/components/settings/PrivacySection";
import PlanSection from "@/components/settings/PlanSection";
import DangerZoneSection from "@/components/settings/DangerZoneSection";
import WebhookSection from "@/components/settings/WebhookSection";
import { useUserSettings, Settings } from "@/hooks/useUserSettings";

// Configuração inicial padrão para settings
const initialSettings: Settings = {
  notifications: true,
  emailNotifications: true,
  workoutReminders: true,
  mealReminders: true,
  theme: 'light',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  webhook_url: "",
};

const Configuracoes = () => {
  const {
    settings,
    setSettings,
    loading,
    handleToggle,
    handleSelectChange,
    handleSave,
    handleWebhookTest
  } = useUserSettings(initialSettings);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-1 text-sm text-gray-600">Personalize sua experiência no MetaFit AI.</p>
        </div>
        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {/* Notificações */}
            <NotificationsSection
              settings={{
                notifications: settings.notifications,
                emailNotifications: settings.emailNotifications,
                workoutReminders: settings.workoutReminders,
                mealReminders: settings.mealReminders,
              }}
              handleToggle={handleToggle}
              disabled={loading}
            />

            {/* Aparência */}
            <AppearanceSection
              theme={settings.theme}
              setTheme={val => handleSelectChange("theme", val)}
              disabled={loading}
            />

            {/* Idioma e Região */}
            <LocaleSection
              language={settings.language}
              setLanguage={val => handleSelectChange("language", val)}
              timezone={settings.timezone}
              setTimezone={val => handleSelectChange("timezone", val)}
              disabled={loading}
            />

            {/* Privacidade e Segurança */}
            <PrivacySection />

            {/* Plano e Faturamento */}
            <PlanSection />

            {/* Zona de Perigo */}
            <DangerZoneSection />

            {/* Webhook/Integrações personalizadas */}
            <WebhookSection
              webhook_url={settings.webhook_url}
              setWebhookUrl={val => setSettings(prev => ({ ...prev, webhook_url: val }))}
              onTest={handleWebhookTest}
              loading={loading}
            />

            {/* Integração com IAs */}
            <AIIntegrationSection />

            {/* Contextos personalizados do usuário para IA */}
            <AIUserContextsSection />

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <Button type="submit" className="px-6 py-3" disabled={loading}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuracoes;
