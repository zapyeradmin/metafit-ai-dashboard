
-- Conectar user_nutrition_preferences, ai_user_contexts e workout_templates ao perfil do usuário.

ALTER TABLE public.user_nutrition_preferences
  ADD CONSTRAINT fk_user_nutrition_preferences_user
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;

ALTER TABLE public.ai_user_contexts
  ADD CONSTRAINT fk_ai_user_contexts_user
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;

-- Só adicione se os workout_templates forem por usuário, não globais.
ALTER TABLE public.workout_templates
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD CONSTRAINT fk_workout_templates_user
    FOREIGN KEY (user_id)
    REFERENCES public.profiles(user_id)
    ON DELETE CASCADE;
