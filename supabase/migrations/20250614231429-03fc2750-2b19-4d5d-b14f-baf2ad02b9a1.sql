
-- Cria a nova tabela de histórico de dados físicos por usuário, com data e demais campos.
CREATE TABLE public.user_physical_data_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  data_date DATE NOT NULL DEFAULT CURRENT_DATE,
  body_type TEXT,
  dominant_hand TEXT,
  blood_type TEXT,
  resting_heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  body_temperature NUMERIC,
  metabolism_type TEXT,
  water_intake_daily INTEGER,
  sleep_hours_daily NUMERIC,
  stress_level INTEGER,
  training_experience TEXT,
  training_frequency INTEGER,
  preferred_training_time TEXT,
  recovery_time_hours INTEGER,
  dietary_restrictions TEXT[],
  allergies TEXT[],
  supplements TEXT[],
  meals_per_day INTEGER,
  neck_circumference NUMERIC,
  wrist_circumference NUMERIC,
  ankle_circumference NUMERIC,
  body_frame TEXT,
  bone_density NUMERIC,
  visceral_fat_level INTEGER,
  metabolic_age INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permite RLS para garantir o acesso apenas ao próprio usuário
ALTER TABLE public.user_physical_data_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: cada usuário só vê, insere, atualiza e deleta seus registros
CREATE POLICY "Can read own physical data history" ON public.user_physical_data_history
  FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY "Can insert own physical data history" ON public.user_physical_data_history
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Can update own physical data history" ON public.user_physical_data_history
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY "Can delete own physical data history" ON public.user_physical_data_history
  FOR DELETE USING (auth.uid()::uuid = user_id);
