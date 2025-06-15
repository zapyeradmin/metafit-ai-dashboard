
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipagem do objeto de configurações do usuário
export type Settings = {
  notifications: boolean;
  emailNotifications: boolean;
  workoutReminders: boolean;
  mealReminders: boolean;
  theme: string;
  language: string;
  timezone: string;
  webhook_url: string;
};

export function useUserSettings(initialSettings: Settings) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [loading, setLoading] = useState(false);

  // Carrega configurações do banco na montagem
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
        if (data && typeof data === 'object' && !("message" in data)) {
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
    // eslint-disable-next-line
  }, []);

  // Handlers
  function handleToggle(setting: keyof Settings) {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  }

  function handleSelectChange(setting: keyof Settings, value: string) {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  }

  // Atualiza/cria configurações no banco
  async function handleSave(e?: React.FormEvent) {
    if (e && e.preventDefault) e.preventDefault();
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
  }

  // Testa envio de webhook 
  async function handleWebhookTest() {
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
        mode: "no-cors",
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
  }

  return {
    settings,
    setSettings,
    loading,
    handleToggle,
    handleSelectChange,
    handleSave,
    handleWebhookTest,
  };
}
