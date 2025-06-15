
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let eventPayload: any = {};
  try {
    eventPayload = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Payload inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Log do evento recebido (ajuste conforme a necessidade)
  console.log("WEBHOOK RECEBIDO:", {
    body: eventPayload,
    headers: Object.fromEntries(req.headers.entries()),
    received_at: new Date().toISOString(),
  });

  // Aqui poderia processar ou agendar para processar o evento...
  // Exemplo: gravar em tabela, disparar notificação, etc.

  return new Response(JSON.stringify({ status: "success", received: eventPayload }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
