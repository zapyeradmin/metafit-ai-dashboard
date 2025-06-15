
-- Função: retorna progresso semanal com contagem de treinos e refeições por usuário
CREATE OR REPLACE FUNCTION public.dashboard_weekly_progress(p_user_id uuid, p_start date, p_end date)
RETURNS TABLE(
  prog_date date,
  workouts integer,
  meals integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dt::date as prog_date,
    (SELECT count(*) FROM daily_workouts WHERE user_id = p_user_id AND date = dt) as workouts,
    (SELECT count(*) FROM daily_meals WHERE user_id = p_user_id AND date = dt AND is_completed = true) as meals
  FROM generate_series(p_start, p_end, interval '1 day') dt;
END;
$$ LANGUAGE plpgsql STABLE;

-- Permite uso via API (opcional; para o Supabase acessar)
GRANT EXECUTE ON FUNCTION public.dashboard_weekly_progress(uuid, date, date) TO anon, authenticated;
