
-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outro')),
  height INTEGER, -- em centímetros
  current_weight DECIMAL(5,2),
  goal_weight DECIMAL(5,2),
  fitness_goal TEXT CHECK (fitness_goal IN ('hipertrofia', 'emagrecimento', 'resistencia', 'manutencao')),
  activity_level TEXT CHECK (activity_level IN ('sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso')),
  gym_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de planos de treino
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('hipertrofia', 'emagrecimento', 'resistencia', 'funcional')),
  difficulty TEXT CHECK (difficulty IN ('iniciante', 'intermediario', 'avancado')),
  duration_weeks INTEGER DEFAULT 8,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de exercícios
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  instructions TEXT,
  difficulty TEXT CHECK (difficulty IN ('iniciante', 'intermediario', 'avancado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de treinos diários
CREATE TABLE public.daily_workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  muscle_groups TEXT[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de exercícios do treino
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_workout_id UUID REFERENCES public.daily_workouts(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL(5,2),
  rest_seconds INTEGER DEFAULT 60,
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de medidas corporais
CREATE TABLE public.body_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass DECIMAL(5,2),
  chest DECIMAL(5,2),
  waist DECIMAL(5,2),
  hips DECIMAL(5,2),
  arms DECIMAL(5,2),
  thighs DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de planos alimentares
CREATE TABLE public.nutrition_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  daily_calories INTEGER,
  protein_grams INTEGER,
  carbs_grams INTEGER,
  fat_grams INTEGER,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de refeições diárias
CREATE TABLE public.daily_meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nutrition_plan_id UUID REFERENCES public.nutrition_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT CHECK (meal_type IN ('cafe_manha', 'lanche_manha', 'almoco', 'lanche_tarde', 'jantar', 'ceia')),
  name TEXT NOT NULL,
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fat DECIMAL(5,2),
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conversas com IA
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de mensagens da IA
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações do usuário
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  workout_reminders BOOLEAN DEFAULT true,
  meal_reminders BOOLEAN DEFAULT true,
  theme TEXT CHECK (theme IN ('light', 'dark', 'auto')) DEFAULT 'light',
  language TEXT DEFAULT 'pt-BR',
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Inserir alguns exercícios básicos
INSERT INTO public.exercises (name, muscle_group, equipment, instructions, difficulty) VALUES
('Supino Reto', 'Peito', 'Barra', 'Deite no banco, agarre a barra com pegada média, desça até o peito e empurre para cima.', 'intermediario'),
('Agachamento', 'Pernas', 'Barra', 'Posicione a barra nas costas, desça mantendo as costas retas, volte à posição inicial.', 'intermediario'),
('Levantamento Terra', 'Costas', 'Barra', 'Agarre a barra, mantenha as costas retas, levante usando pernas e quadril.', 'avancado'),
('Desenvolvimento', 'Ombros', 'Halteres', 'Sente-se, segure os halteres na altura dos ombros, empurre para cima.', 'intermediario'),
('Rosca Direta', 'Bíceps', 'Barra', 'Em pé, segure a barra, flexione os cotovelos mantendo o corpo estável.', 'iniciante'),
('Tríceps Testa', 'Tríceps', 'Barra EZ', 'Deite no banco, flexione apenas os cotovelos, desça a barra até a testa.', 'iniciante'),
('Puxada Frontal', 'Costas', 'Máquina', 'Sente-se, puxe a barra até o peito, controle o movimento na volta.', 'iniciante'),
('Leg Press', 'Pernas', 'Máquina', 'Sente-se na máquina, coloque os pés na plataforma, empurre com força.', 'iniciante');

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para workout_plans
CREATE POLICY "Users can view their own workout plans" ON public.workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workout plans" ON public.workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workout plans" ON public.workout_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workout plans" ON public.workout_plans FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para daily_workouts
CREATE POLICY "Users can view their own daily workouts" ON public.daily_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own daily workouts" ON public.daily_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily workouts" ON public.daily_workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own daily workouts" ON public.daily_workouts FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para workout_exercises
CREATE POLICY "Users can view their own workout exercises" ON public.workout_exercises FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.daily_workouts WHERE id = daily_workout_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own workout exercises" ON public.workout_exercises FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.daily_workouts WHERE id = daily_workout_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their own workout exercises" ON public.workout_exercises FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.daily_workouts WHERE id = daily_workout_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their own workout exercises" ON public.workout_exercises FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.daily_workouts WHERE id = daily_workout_id AND user_id = auth.uid())
);

-- Políticas RLS para body_measurements
CREATE POLICY "Users can view their own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para nutrition_plans
CREATE POLICY "Users can view their own nutrition plans" ON public.nutrition_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own nutrition plans" ON public.nutrition_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition plans" ON public.nutrition_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition plans" ON public.nutrition_plans FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para daily_meals
CREATE POLICY "Users can view their own daily meals" ON public.daily_meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own daily meals" ON public.daily_meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily meals" ON public.daily_meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own daily meals" ON public.daily_meals FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para ai_conversations
CREATE POLICY "Users can view their own AI conversations" ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own AI conversations" ON public.ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own AI conversations" ON public.ai_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own AI conversations" ON public.ai_conversations FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para ai_messages
CREATE POLICY "Users can view their own AI messages" ON public.ai_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own AI messages" ON public.ai_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.ai_conversations WHERE id = conversation_id AND user_id = auth.uid())
);

-- Políticas RLS para user_settings
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Exercícios são públicos para todos os usuários autenticados
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view exercises" ON public.exercises FOR SELECT TO authenticated USING (true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger de updated_at em tabelas relevantes
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workout_plans_updated_at BEFORE UPDATE ON public.workout_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_workouts_updated_at BEFORE UPDATE ON public.daily_workouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_nutrition_plans_updated_at BEFORE UPDATE ON public.nutrition_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
