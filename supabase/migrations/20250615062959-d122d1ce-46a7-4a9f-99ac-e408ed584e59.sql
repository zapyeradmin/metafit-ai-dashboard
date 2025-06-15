
-- Usuários: adicionar telefone, endereço e papel (role)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Planos: adicionar número máximo de usuários e recursos/features do plano em JSONB
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS max_users INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS features JSONB;

-- Gateways de pagamento: adicionar URL de webhook e moedas suportadas
ALTER TABLE public.payment_gateways
  ADD COLUMN IF NOT EXISTS webhook_url TEXT,
  ADD COLUMN IF NOT EXISTS supported_currencies TEXT[];
