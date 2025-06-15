
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Setup client with service role for secure DB actions.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  // Auth user id from JWT in header
  const authHeader = req.headers.get("authorization");
  const jwt = authHeader?.replace("Bearer ", "");
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Usuário não autenticado." }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const user_id = user.id;

  let body: any = {};
  try {
    body = req.method === "GET" ? {} : await req.json();
  } catch (e) {}

  // Handle GET: lista integrações (sem exibir API keys!)
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("ai_integrations")
      .select("id,provider,is_active,created_at,updated_at")
      .eq("user_id", user_id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: corsHeaders }
      );
    }
    return new Response(JSON.stringify({ integrations: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Cria ou atualiza chave
  if (body.action === "save_key") {
    const { provider, api_key } = body;
    if (!provider || !api_key) {
      return new Response(
        JSON.stringify({ error: "Provider e api_key são obrigatórios." }),
        { status: 400, headers: corsHeaders }
      );
    }
    // Upsert (insere ou atualiza)
    const { error } = await supabase
      .from("ai_integrations")
      .upsert([
        {
          user_id,
          provider,
          api_key,
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "user_id,provider" });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400, headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Seta qual IA é ativa
  if (body.action === "set_active") {
    const { provider } = body;
    if (!provider) {
      return new Response(JSON.stringify({ error: "Provider é obrigatório." }), {
        status: 400, headers: corsHeaders,
      });
    }
    // Set is_active false para todas do user, true só para escolhida
    const { error } = await supabase
      .from("ai_integrations")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("user_id", user_id);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400, headers: corsHeaders,
      });
    }
    const { error: setError } = await supabase
      .from("ai_integrations")
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq("user_id", user_id)
      .eq("provider", provider);

    if (setError) {
      return new Response(JSON.stringify({ error: setError.message }), {
        status: 400, headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Se ação desconhecida
  return new Response(JSON.stringify({ error: "Ação não suportada" }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
