
-- Cria tabela para armazenar documentos/contextos/prompt customizados do usuário
CREATE TABLE public.ai_user_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL, -- título ou identificação do documento/contexto
  content TEXT NOT NULL, -- texto do contexto, documento, prompt
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilita RLS: só o dono pode acessar/editar seus próprios contextos
ALTER TABLE public.ai_user_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ler seus próprios contextos IA"
  ON public.ai_user_contexts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios contextos IA"
  ON public.ai_user_contexts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios contextos IA"
  ON public.ai_user_contexts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios contextos IA"
  ON public.ai_user_contexts
  FOR DELETE
  USING (auth.uid() = user_id);
