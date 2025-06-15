
-- Criação da tabela principal dos dados de saúde do usuário

CREATE TABLE public.user_health_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Condições diagnosticadas
  diagnosed_conditions TEXT[] NULL,
  diagnosed_conditions_other TEXT NULL,

  -- Histórico familiar
  family_health_conditions TEXT[] NULL,
  family_health_conditions_other TEXT NULL,

  -- Medicamentos
  regular_medication TEXT NULL, -- "Sim" ou "Não"
  medication_affects_exercise TEXT NULL, -- "Sim", "Não", "Não sei"

  -- Limitações físicas & dor
  has_physical_limitations TEXT NULL, -- "Sim" ou "Não"
  physical_limitations_description TEXT NULL,
  pain_areas TEXT[] NULL,

  -- Hábitos Alimentares
  meals_per_day TEXT NULL,
  fruits_vegetables_frequency TEXT NULL,
  protein_frequency TEXT NULL,
  carbs_frequency TEXT NULL,
  processed_food_frequency TEXT NULL,
  water_consumption TEXT NULL,
  specific_diet TEXT[],
  specific_diet_other TEXT,

  -- Hábitos de Sono
  sleep_hours TEXT NULL,
  sleep_quality INTEGER NULL, -- 1-5

  -- Nível de Estresse
  stress_rating INTEGER NULL, -- 1-5
  relaxation_techniques TEXT[],

  -- Rotina diária
  daily_activities TEXT[],

  -- Foreign key para garantir integridade com usuários
  CONSTRAINT fk_user_health_data_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- Ativa RLS
ALTER TABLE public.user_health_data ENABLE ROW LEVEL SECURITY;

-- Somente o próprio usuário pode acessar seus dados
CREATE POLICY "Users can view their own health data" ON public.user_health_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data" ON public.user_health_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data" ON public.user_health_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data" ON public.user_health_data
  FOR DELETE USING (auth.uid() = user_id);

