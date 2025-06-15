
-- 1. Criar tabela para preferências de treino do usuário
CREATE TABLE public.user_workout_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  experience_level TEXT NOT NULL,
  available_equipment TEXT[] NOT NULL,
  training_days_per_week INTEGER NOT NULL CHECK (training_days_per_week > 0 AND training_days_per_week <= 7),
  time_per_session INTEGER NOT NULL CHECK (time_per_session > 0),
  injury_considerations TEXT[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  last_plan_generated TIMESTAMPTZ DEFAULT NULL,
  current_plan_week INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Relacionar múltiplos usuários, permite um preference por usuário (restrição única)
CREATE UNIQUE INDEX uniq_preference_per_user ON public.user_workout_preferences(user_id);

-- 3. Melhorar tabela exercises com informações de progressão
ALTER TABLE public.exercises
  ADD COLUMN IF NOT EXISTS sets_range TEXT,
  ADD COLUMN IF NOT EXISTS reps_range TEXT,
  ADD COLUMN IF NOT EXISTS rest_time_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS progression_type TEXT;

-- 4. Tabela para fallback de templates
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  goal TEXT NOT NULL, -- fat_loss / muscle_gain / maintenance etc
  experience_level TEXT NOT NULL,
  training_days_per_week INTEGER,
  focus_areas TEXT[] DEFAULT '{}',
  structure JSONB NOT NULL, -- lista dos treinos da semana e exercícios por dia
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Marcar treinos "gerados por IA"
ALTER TABLE public.daily_workouts
  ADD COLUMN IF NOT EXISTS generated_by_ai BOOLEAN DEFAULT false;

-- 6. Adicionar gatilhos para updated_at nas novas tabelas
CREATE OR REPLACE FUNCTION public.set_timestamp_on_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_on_update_user_workout_preferences
BEFORE UPDATE ON public.user_workout_preferences
FOR EACH ROW EXECUTE FUNCTION public.set_timestamp_on_update();

-- 7. Políticas RLS (acesso apenas ao próprio usuário)
ALTER TABLE public.user_workout_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can manage own workout prefs"
  ON public.user_workout_preferences
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
-- Fallback templates podem ser públicos; restrinja UPDATE/DELETE se desejar!

-- 8. Index para busca eficiente de templates por goal/nível
CREATE INDEX idx_template_goal_level ON public.workout_templates(goal, experience_level);

