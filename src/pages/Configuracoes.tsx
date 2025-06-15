import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AIIntegrationSection from "@/components/settings/AIIntegrationSection";
import AIUserContextsSection from "@/components/settings/AIUserContextsSection";
import { supabase } from "@/integrations/supabase/client";
import NotificationsSection from "@/components/settings/NotificationsSection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import LocaleSection from "@/components/settings/LocaleSection";
import PrivacySection from "@/components/settings/PrivacySection";
import PlanSection from "@/components/settings/PlanSection";
import DangerZoneSection from "@/components/settings/DangerZoneSection";
import WebhookSection from "@/components/settings/WebhookSection";

// Adicione um type para user settings, considerando campo webhook
type Settings = {
  notifications: boolean;
  emailNotifications: boolean;
  workoutReminders: boolean;
  mealReminders: boolean;
  theme: string;
  language: string;
  timezone: string;
  webhook_url: string;
};

const Configuracoes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Inicia o settings com o campo webhook_url
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    emailNotifications: true,
    workoutReminders: true,
    mealReminders: true,
    theme: 'light',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    webhook_url: "",
  });

  // Carrega configurações do user_settings (inclui webhook_url)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) throw new Error("Erro ao obter usuário");
        const { data, error } = await supabase
          .from('user_settings')
          .select("notifications_enabled, email_notifications, workout_reminders, meal_reminders, theme, language, timezone, webhook_url")
          .eq('user_id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setSettings(prev => ({
            ...prev,
            notifications: data.notifications_enabled ?? prev.notifications,
            emailNotifications: data.email_notifications ?? prev.emailNotifications,
            workoutReminders: data.workout_reminders ?? prev.workoutReminders,
            mealReminders: data.meal_reminders ?? prev.mealReminders,
            theme: data.theme ?? prev.theme,
            language: data.language ?? prev.language,
            timezone: data.timezone ?? prev.timezone,
            webhook_url: data.webhook_url ?? "",
          }));
        }
      } catch (err: any) {
        toast({ title: "Erro ao carregar configurações", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Salva configurações (inclui webhook_url)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) throw new Error("Usuário não autenticado");
      const updateData = {
        notifications_enabled: settings.notifications,
        email_notifications: settings.emailNotifications,
        workout_reminders: settings.workoutReminders,
        meal_reminders: settings.mealReminders,
        theme: settings.theme,
        language: settings.language,
        timezone: settings.timezone,
        webhook_url: settings.webhook_url,
        updated_at: new Date().toISOString(),
        user_id: user.id,
      };
      await supabase
        .from('user_settings')
        .upsert([updateData], { onConflict: 'user_id' });

      toast({ title: "Configurações salvas!" });
    } catch (err: any) {
      toast({
        title: "Erro ao salvar as configurações",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (setting: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSelectChange = (setting: keyof Settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Handler para testar webhook
  const handleWebhookTest = async () => {
    if (!settings.webhook_url) {
      toast({ title: "Insira a URL do Webhook antes de testar." });
      return;
    }
    setLoading(true);
    try {
      await fetch(settings.webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "test", timestamp: new Date().toISOString() }),
        mode: "no-cors", // permite maior compatibilidade com Zapier/N8N
      });
      toast({
        title: "Webhook Disparado",
        description: "Solicitação enviada. Verifique o histórico do seu serviço (N8N ou Zapier).",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao testar webhook",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
