
// Use npm: prefix for Deno edge functions
import { serve } from "std/server";
import { createClient } from "npm:@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { email, password, full_name } = payload;

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });
  }

  // 1. Create the user via Supabase auth admin
  const { data: userRes, error: errCreate } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (errCreate || !userRes?.user) {
    return new Response(JSON.stringify({ error: errCreate?.message || "Erro", detail: errCreate }), {
      status: 400,
    });
  }

  // 2. Insert profile with is_active: true
  const { error: errProfile } = await supabase.from('profiles').insert([{
    user_id: userRes.user.id,
    full_name,
    is_active: true,
  }]);

  if (errProfile) {
    return new Response(
      JSON.stringify({ error: 'Usuário criado, mas perfil não foi salvo', detail: errProfile.message }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ success: true, userId: userRes.user.id }), { status: 200 });
});
