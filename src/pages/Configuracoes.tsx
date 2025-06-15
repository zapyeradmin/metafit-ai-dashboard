import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AIIntegrationSection from "@/components/settings/AIIntegrationSection";
import AIUserContextsSection from "@/components/settings/AIUserContextsSection";
import { supabase } from "@/integrations/supabase/client";

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

            {/* Webhook/Integrações personalizadas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Integração: Webhook para Automação</h3>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL do Webhook (N8N, Zapier, etc)</label>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
                <Input
                  placeholder="https://seu-servidor.com/webhook..."
                  value={settings.webhook_url}
                  onChange={e => setSettings(prev => ({ ...prev, webhook_url: e.target.value }))}
                  className="w-full"
                  autoComplete="off"
                  disabled={loading}
                />
                <Button
                  type="button"
                  className="w-full md:w-auto"
                  variant="outline"
                  onClick={handleWebhookTest}
                  disabled={!settings.webhook_url || loading}
                >
                  Testar Webhook
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Qualquer automação pode ser disparada pelo MetaFit AI.<br />
                Use o endereço de Webhook do N8N, Zapier, Make ou outro.
              </div>
            </div>

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
