
-- Criação da tabela de preferências de alimentação do usuário
CREATE TABLE public.user_nutrition_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  diet_goal TEXT NOT NULL,
  dietary_restrictions TEXT[] NOT NULL,
  preferred_foods TEXT[] NOT NULL,
  avoid_foods TEXT[] NOT NULL,
  calories_target INTEGER NOT NULL,
  protein_target INTEGER NOT NULL,
  carb_target INTEGER NOT NULL,
  fat_target INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar índice para buscas rápidas por usuário
CREATE INDEX idx_user_nutrition_preferences_user_id ON public.user_nutrition_preferences(user_id);

-- Ativar Row Level Security
ALTER TABLE public.user_nutrition_preferences ENABLE ROW LEVEL SECURITY;

-- Permitir SELECT/INSERT/UPDATE/DELETE apenas ao dono do registro
CREATE POLICY "Somente o dono pode ver" ON public.user_nutrition_preferences
  FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Somente o dono pode inserir" ON public.user_nutrition_preferences
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Somente o dono pode atualizar" ON public.user_nutrition_preferences
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Somente o dono pode deletar" ON public.user_nutrition_preferences
  FOR DELETE USING (auth.uid()::uuid = user_id);
