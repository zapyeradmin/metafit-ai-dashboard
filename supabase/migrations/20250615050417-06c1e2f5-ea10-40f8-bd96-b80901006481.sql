
-- Tabela de Planos
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_percent_yearly NUMERIC(5,2) NOT NULL DEFAULT 0,
  resource_limits JSONB, -- Pode armazenar limites ou regras customizadas do plano
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Assinaturas do Usuário
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE SET NULL,
  payment_gateway TEXT NOT NULL, -- 'stripe', 'asaas', 'mercadopago'
  gateway_subscription_id TEXT, -- id original no gateway
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing', etc.
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
  is_trial BOOLEAN NOT NULL DEFAULT FALSE,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela para Gateway de Pagamentos configurados
CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'stripe', 'asaas', 'mercadopago'
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  credentials JSONB, -- Aqui podemos guardar config pública (não as keys secretas)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ativar RLS e criar políticas:
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- Usuários autenticados podem ver planos ativos
CREATE POLICY "planos ativos públicos" ON public.plans
FOR SELECT USING (is_active);

-- Usuário só vê e muda sua própria assinatura
CREATE POLICY "ver suas assinaturas" ON public.user_subscriptions
FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "criar assinatura própria" ON public.user_subscriptions
FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "alterar assinatura própria" ON public.user_subscriptions
FOR UPDATE USING (user_id = auth.uid());

-- Gateways visíveis a todos autenticados
CREATE POLICY "gateways públicos" ON public.payment_gateways
FOR SELECT USING (is_active);

