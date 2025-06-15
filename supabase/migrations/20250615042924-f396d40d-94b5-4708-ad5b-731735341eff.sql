
-- Cria tabela para guardar preferência de IA e estado das chaves por usuário
CREATE TABLE public.ai_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'gemini', 'deepseek', 'claude', 'openrouter')),
  api_key TEXT, -- armazenaremos encriptada ou usaremos edge secrets, depende do fluxo
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Garante que cada usuário possa ter uma integração de cada tipo apenas
CREATE UNIQUE INDEX ai_integrations_user_provider_idx ON public.ai_integrations(user_id, provider);

-- Habilita RLS (Row Level Security)
ALTER TABLE public.ai_integrations ENABLE ROW LEVEL SECURITY;

-- Permite ao usuário acessar, editar, inserir e deletar apenas SUAS integrações:
CREATE POLICY "Users can select their own ai integrations"
  ON public.ai_integrations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ai integration"
  ON public.ai_integrations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai integration"
  ON public.ai_integrations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ai integration"
  ON public.ai_integrations
  FOR DELETE
  USING (auth.uid() = user_id);
