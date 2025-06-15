
-- Adiciona a coluna webhook_url na tabela user_settings
ALTER TABLE public.user_settings
ADD COLUMN webhook_url text;

-- Opcional: pode criar um índice se espera consultas frequentes (não obrigatório)
-- CREATE INDEX user_settings_webhook_url_idx ON public.user_settings(webhook_url);
