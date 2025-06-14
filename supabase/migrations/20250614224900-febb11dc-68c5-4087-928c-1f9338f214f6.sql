
-- Adiciona os novos campos à tabela profiles se ainda não existirem
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS height INTEGER,
  ADD COLUMN IF NOT EXISTS goal_weight NUMERIC,
  ADD COLUMN IF NOT EXISTS fitness_goal TEXT,
  ADD COLUMN IF NOT EXISTS activity_level TEXT;

-- Opcional: Definir valores default ou NULL para manter compatibilidade
-- Nenhuma alteração nos RLS, pois a tabela segue permitida para cada usuário manipular seus próprios dados.

