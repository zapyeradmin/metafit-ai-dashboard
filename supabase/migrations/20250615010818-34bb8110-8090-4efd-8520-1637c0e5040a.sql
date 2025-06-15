
-- Índices combinados para acelerar consultas por usuário e data
CREATE INDEX IF NOT EXISTS idx_daily_meals_user_date ON daily_meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_workouts_user_date ON daily_workouts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON body_measurements(user_id, date);

-- Índice parcial para consultas rápidas de refeições já marcadas como concluídas
CREATE INDEX IF NOT EXISTS idx_daily_meals_completed ON daily_meals(is_completed) WHERE is_completed = true;
CREATE INDEX IF NOT EXISTS idx_daily_workouts_completed ON daily_workouts(is_completed) WHERE is_completed = true;

-- View agregada para facilitar cálculos diários e reuso no frontend ou edge functions
CREATE OR REPLACE VIEW v_meal_macros_user_day AS
SELECT
  user_id,
  date,
  SUM(calories) AS total_calories,
  SUM(protein) AS total_protein,
  SUM(carbs) AS total_carbs,
  SUM(fat) AS total_fat
FROM daily_meals
GROUP BY user_id, date;
