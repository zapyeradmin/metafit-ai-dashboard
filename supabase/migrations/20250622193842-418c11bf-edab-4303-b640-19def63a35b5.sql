
-- Criar tabela workout_progression_logic para armazenar a lógica de periodização
CREATE TABLE public.workout_progression_logic (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treino_id TEXT NOT NULL UNIQUE,
  arquivo TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  nivel TEXT NOT NULL,
  duracao_semanas INTEGER NOT NULL,
  proximo_treino_id TEXT,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar campos de progressão à tabela user_workout_preferences
ALTER TABLE public.user_workout_preferences
  ADD COLUMN IF NOT EXISTS treino_atual_id TEXT,
  ADD COLUMN IF NOT EXISTS semanas_completadas_no_treino_atual INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS objetivo_atual TEXT,
  ADD COLUMN IF NOT EXISTS data_inicio_treino_atual TIMESTAMP WITH TIME ZONE;

-- Criar tabela user_workout_progress para rastrear histórico semanal
CREATE TABLE public.user_workout_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  treino_id TEXT NOT NULL,
  semana INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  completado BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_user_workout_progress_user FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Popular workout_progression_logic com os dados de emagrecimento
INSERT INTO public.workout_progression_logic (treino_id, arquivo, objetivo, nivel, duracao_semanas, proximo_treino_id, descricao) VALUES
-- Emagrecimento
('emag_iniciante_1', 'workout_emagrecimento_iniciante_1.md', 'emagrecimento', 'Iniciante', 6, 'emag_iniciante_2', 'Primeira fase do emagrecimento para iniciantes'),
('emag_iniciante_2', 'workout_emagrecimento_iniciante_2.md', 'emagrecimento', 'Iniciante', 6, 'emag_intermediario_1', 'Segunda fase do emagrecimento para iniciantes'),
('emag_intermediario_1', 'workout_emagrecimento_intermediario_1.md', 'emagrecimento', 'Intermediário', 8, 'emag_intermediario_2', 'Primeira fase intermediária de emagrecimento'),
('emag_intermediario_2', 'workout_emagrecimento_intermediario_2.md', 'emagrecimento', 'Intermediário', 8, 'emag_avancado_1', 'Segunda fase intermediária de emagrecimento'),
('emag_avancado_1', 'workout_emagrecimento_avancado_1.md', 'emagrecimento', 'Avançado', 6, 'emag_avancado_inferiores_1', 'Primeira fase avançada de emagrecimento'),
('emag_avancado_inferiores_1', 'workout_emagrecimento_avancado_inferiores_1.md', 'emagrecimento', 'Avançado - Ênfase Inferiores', 4, 'emag_avancado_2', 'Fase avançada com ênfase em membros inferiores'),
('emag_avancado_2', 'workout_emagrecimento_avancado_2.md', 'emagrecimento', 'Avançado', 6, 'emag_avancado_inferiores_2', 'Segunda fase avançada de emagrecimento'),
('emag_avancado_inferiores_2', 'workout_emagrecimento_avancado_inferiores_2.md', 'emagrecimento', 'Avançado - Ênfase Inferiores', 6, 'emag_elite_1', 'Segunda fase avançada com ênfase em inferiores'),
('emag_elite_1', 'workout_emagrecimento_ultra_avancado_elite_2.md', 'emagrecimento', 'Elite', 4, 'emag_elite_inferiores_final', 'Primeira fase elite de emagrecimento'),
('emag_elite_inferiores_final', 'workout_emagrecimento_avancado_inferiores_elite.md', 'emagrecimento', 'Elite - Ênfase Inferiores', 4, NULL, 'Fase final elite com ênfase em inferiores'),

-- Hipertrofia
('hiper_iniciante_1', 'workout_hipertrofia_iniciante_1.md', 'hipertrofia', 'Iniciante', 6, 'hiper_iniciante_2', 'Primeira fase de hipertrofia para iniciantes'),
('hiper_iniciante_2', 'workout_hipertrofia_iniciante_2.md', 'hipertrofia', 'Iniciante', 6, 'hiper_intermediario_1', 'Segunda fase de hipertrofia para iniciantes'),
('hiper_intermediario_1', 'workout_hipertrofia_intermediario_1.md', 'hipertrofia', 'Intermediário', 8, 'hiper_intermediario_2', 'Primeira fase intermediária de hipertrofia'),
('hiper_intermediario_2', 'workout_hipertrofia_intermediario_2.md', 'hipertrofia', 'Intermediário', 8, 'hiper_avancado_1', 'Segunda fase intermediária de hipertrofia'),
('hiper_avancado_1', 'workout_hipertrofia_avancado_1.md', 'hipertrofia', 'Avançado', 6, 'hiper_avancado_2', 'Primeira fase avançada de hipertrofia'),
('hiper_avancado_2', 'workout_hipertrofia_avancado_2.md', 'hipertrofia', 'Avançado', 6, 'hiper_extreme_1', 'Segunda fase avançada de hipertrofia'),
('hiper_extreme_1', 'workout_hipertrofia_avancado_extreme.md', 'hipertrofia', 'Extremo', 4, 'hiper_extreme_2', 'Primeira fase extrema de hipertrofia'),
('hiper_extreme_2', 'workout_hipertrofia_avancado_extreme.md', 'hipertrofia', 'Extremo - Bloco 2', 4, NULL, 'Segunda fase extrema de hipertrofia'),

-- Core e Mobilidade
('core_base_1', 'workout_core_mobilidade_1.md', 'core_mobilidade', 'Base', 4, 'core_avancado_1', 'Fase base de core e mobilidade'),
('core_avancado_1', 'workout_core_mobilidade_avancado.md', 'core_mobilidade', 'Avançado', 6, NULL, 'Fase avançada de core e mobilidade');

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.workout_progression_logic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workout_progress ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para workout_progression_logic (leitura pública)
CREATE POLICY "Todos podem ver lógica de progressão" 
  ON public.workout_progression_logic 
  FOR SELECT 
  USING (true);

-- Políticas RLS para user_workout_progress
CREATE POLICY "Usuários podem ver seu próprio progresso" 
  ON public.user_workout_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seu próprio progresso" 
  ON public.user_workout_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso" 
  ON public.user_workout_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at na workout_progression_logic
CREATE TRIGGER update_workout_progression_logic_updated_at
  BEFORE UPDATE ON public.workout_progression_logic
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
