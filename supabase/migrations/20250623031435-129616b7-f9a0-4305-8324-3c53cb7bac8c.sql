
-- Adicionar constraint único na coluna template_name para permitir upsert
ALTER TABLE public.workout_templates 
ADD CONSTRAINT workout_templates_template_name_unique UNIQUE (template_name);

-- Criar índice para melhorar performance nas consultas por template_name
CREATE INDEX IF NOT EXISTS idx_workout_templates_template_name 
ON public.workout_templates(template_name);

-- Criar índice composto para consultas por objetivo e nível
CREATE INDEX IF NOT EXISTS idx_workout_templates_goal_level 
ON public.workout_templates(goal, experience_level);
