
-- Criar tabela para informações físicas e nutricionais adicionais
CREATE TABLE public.user_physical_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Informações físicas básicas
  body_type TEXT, -- ectomorfo, mesomorfo, endomorfo
  dominant_hand TEXT, -- destro, canhoto, ambidestro
  blood_type TEXT, -- A+, A-, B+, B-, AB+, AB-, O+, O-
  
  -- Informações de saúde
  resting_heart_rate INTEGER, -- batimentos por minuto em repouso
  blood_pressure_systolic INTEGER, -- pressão arterial sistólica
  blood_pressure_diastolic INTEGER, -- pressão arterial diastólica
  body_temperature NUMERIC(4,2), -- temperatura corporal em °C
  
  -- Informações metabólicas
  metabolism_type TEXT, -- lento, normal, acelerado
  water_intake_daily INTEGER, -- litros de água por dia (em ml)
  sleep_hours_daily NUMERIC(3,1), -- horas de sono por dia
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10), -- nível de stress de 1-10
  
  -- Informações de treino
  training_experience TEXT, -- iniciante, intermediário, avançado, expert
  training_frequency INTEGER, -- vezes por semana
  preferred_training_time TEXT, -- manhã, tarde, noite
  recovery_time_hours INTEGER, -- tempo de recuperação entre treinos
  
  -- Informações nutricionais
  dietary_restrictions TEXT[], -- vegetariano, vegano, sem lactose, etc
  allergies TEXT[], -- alergias alimentares
  supplements TEXT[], -- suplementos que usa
  meals_per_day INTEGER, -- número de refeições por dia
  
  -- Medidas específicas para cálculos
  neck_circumference NUMERIC(5,2), -- circunferência do pescoço (cm)
  wrist_circumference NUMERIC(5,2), -- circunferência do pulso (cm)
  ankle_circumference NUMERIC(5,2), -- circunferência do tornozelo (cm)
  body_frame TEXT, -- pequeno, médio, grande
  
  -- Informações de composição corporal
  bone_density NUMERIC(4,2), -- densidade óssea
  visceral_fat_level INTEGER, -- nível de gordura visceral
  metabolic_age INTEGER, -- idade metabólica
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_physical_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own physical data" 
  ON public.user_physical_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own physical data" 
  ON public.user_physical_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own physical data" 
  ON public.user_physical_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own physical data" 
  ON public.user_physical_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_user_physical_data_updated_at
  BEFORE UPDATE ON public.user_physical_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
