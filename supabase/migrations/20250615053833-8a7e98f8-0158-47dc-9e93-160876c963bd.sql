
-- Adiciona o campo is_active à tabela profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Torna o campo disponível nas atualizações e inserções
COMMENT ON COLUMN public.profiles.is_active IS 'Usuário ativo/desativado pelo admin.';

-- (Opcional) Garante que sempre que o profile é criado no signup ele já vem com is_active=true
UPDATE public.profiles SET is_active = true WHERE is_active IS NULL;
