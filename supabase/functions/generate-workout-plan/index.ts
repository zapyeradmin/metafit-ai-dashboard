
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, selected_date } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), { status: 400, headers: corsHeaders });
    }

    // SUPABASE
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    // 1. Buscar profile e preferências
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${user_id}`, {
      headers: { apiKey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    const profile = (await profileRes.json())[0];

    const prefsRes = await fetch(`${supabaseUrl}/rest/v1/user_workout_preferences?user_id=eq.${user_id}`, {
      headers: { apiKey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    const prefs = (await prefsRes.json())[0];

    if (!profile || !prefs) {
      return new Response(JSON.stringify({ error: "Profile or preferences not found." }), { status: 400, headers: corsHeaders });
    }

    let generated = null;
    let errorAI = null;
    let usedTemplate = false;

    // 2. Tentar usar template específico baseado no treino atual
    if (prefs.treino_atual_id) {
      console.log('Buscando template para treino atual:', prefs.treino_atual_id);
      
      // Buscar na lógica de progressão para obter o arquivo do treino
      const progressionRes = await fetch(`${supabaseUrl}/rest/v1/workout_progression_logic?treino_id=eq.${prefs.treino_atual_id}`, {
        headers: { apiKey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      const progression = (await progressionRes.json())[0];
      
      if (progression) {
        console.log('Progressão encontrada:', progression.arquivo);
        
        // Buscar template correspondente
        const templateName = progression.arquivo.replace('.md', '').replace('workout_', '');
        const templateRes = await fetch(`${supabaseUrl}/rest/v1/workout_templates?template_name=eq.${templateName}`, {
          headers: { apiKey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        });
        const template = (await templateRes.json())[0];
        
        if (template && template.structure) {
          console.log('Template encontrado:', template.template_name);
          
          // Usar o template como base e personalizar com IA
          const baseStructure = template.structure;
          generated = await personalizeTemplateWithAI(baseStructure, profile, prefs);
          usedTemplate = true;
        }
      }
    }

    // 3. Fallback para geração via IA pura
    if (!generated) {
      console.log('Usando geração via IA pura');
      const userGoal = prefs.objetivo_atual || profile.fitness_goal || "manutenção";
      
      const prompt = `
      Gere um programa de treino semanal dividido entre Segunda e Sábado, com base nas regras abaixo. Estruture a resposta em JSON, separando treinos por semana e detalhando cada dia:

      - Cada dia deve treinar 2 a 3 regiões musculares principais, por exemplo: "Costas e Bíceps", "Peito e Tríceps", "Pernas (Quadríceps, Glúteos, Panturrilha)", "Ombros e Abdômen", "Posterior de Pernas, Glúteos e Panturrilha".
      - Segunda a Sábado são dias de treino, Domingo é descanso ou alongamento leve.
      - Para músculos grandes (costas, peito, pernas): 5 exercícios no dia.
      - Para músculos menores (bíceps, tríceps, abdômen, ombro, panturrilha): 3 a 4 exercícios no dia.
      - Sempre inclua pelo menos um exercício de alongamento e um de aeróbico por dia, escolhendo entre: "Esteira", "Bicicleta", "Elíptico", "Simulador de escada" e "Caminhada livre".
      - Informe séries e repetições de cada exercício (exemplo: 4x12 para grandes, 3x15 para menores, ajuste conforme objetivo).
      - Não repita músculos grandes em dias seguidos.
      - Use as preferências do usuário abaixo:
        - Objetivo: ${userGoal}
        - Nível: ${prefs.experience_level}
        - Dias de treino/semana: ${prefs.training_days_per_week}
        - Tempo por sessão: ${prefs.time_per_session}min
        - Equipamentos disponíveis: ${prefs.available_equipment?.join(", ") || "nenhum"}
        - Lesões: ${prefs.injury_considerations?.join(", ") || "nenhuma"}
        - Áreas de foco: ${prefs.focus_areas?.join(", ") || "equilibrado"}.

      Responda APENAS com o JSON estruturado (sem texto antes ou depois), usando o seguinte modelo:
      {
        "semanas": [
          {
            "dias": [
              {
                "data": "${selected_date || new Date().toISOString().split('T')[0]}",
                "nome": "Costas e Bíceps",
                "grupos_musculares": ["costas", "bíceps"],
                "exercicios": [
                  { "nome": "Puxada alta", "series": 4, "repeticoes": 12 },
                  { "nome": "Rosca direta", "series": 3, "repeticoes": 10 }
                ],
                "aerobico": "Esteira 15min",
                "alongamento": "Alongamento geral 10min"
              }
            ]
          }
        ]
      }
      `;

      try {
        const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
        const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openAIApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "Você é um treinador especialista que gera planos de treino em JSON estruturado." },
              { role: "user", content: prompt }
            ],
            temperature: 0.3
          }),
        });
        const aiData = await aiResp.json();
        generated = aiData.choices?.[0]?.message?.content;
        
        if (generated) {
          const jsonStart = generated.indexOf("{");
          generated = generated.slice(jsonStart);
          generated = JSON.parse(generated);
        }
      } catch (e) {
        errorAI = e.message || "Erro na IA";
        generated = null;
      }
    }

    // 4. Fallback final para template genérico
    if (!generated) {
      const userGoal = prefs.objetivo_atual || profile.fitness_goal || "manutenção";
      const fallbackRes = await fetch(`${supabaseUrl}/rest/v1/workout_templates?goal=eq.${userGoal}&experience_level=eq.${prefs.experience_level}`, {
        headers: { apiKey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      const template = (await fallbackRes.json())[0];
      if (!template) {
        return new Response(JSON.stringify({ error: "Nenhum template fallback encontrado.", errorAI }), { status: 500, headers: corsHeaders });
      }
      generated = template.structure;
    }

    return new Response(JSON.stringify({ 
      workout_plan: generated, 
      used_ai: !errorAI,
      used_template: usedTemplate,
      template_info: usedTemplate ? "Template específico usado baseado na progressão" : "Geração via IA ou template genérico"
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Erro interno" }), { status: 500, headers: corsHeaders });
  }
});

async function personalizeTemplateWithAI(baseStructure, profile, prefs) {
  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) return baseStructure;

    const prompt = `
    Personalize o seguinte template de treino baseado nas preferências do usuário.
    Mantenha a estrutura e progressão original, mas ajuste exercícios, séries e repetições conforme necessário.
    
    Template base: ${JSON.stringify(baseStructure)}
    
    Preferências do usuário:
    - Objetivo: ${prefs.objetivo_atual || profile.fitness_goal}
    - Nível: ${prefs.experience_level}
    - Equipamentos: ${prefs.available_equipment?.join(", ") || "básicos"}
    - Lesões: ${prefs.injury_considerations?.join(", ") || "nenhuma"}
    - Áreas de foco: ${prefs.focus_areas?.join(", ") || "equilibrado"}
    
    Retorne APENAS o JSON personalizado mantendo a mesma estrutura.
    `;

    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Você é um especialista em personalização de treinos. Mantenha sempre a estrutura original mas personalize os detalhes." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      }),
    });

    const aiData = await aiResp.json();
    const personalizedContent = aiData.choices?.[0]?.message?.content;
    
    if (personalizedContent) {
      const jsonStart = personalizedContent.indexOf("{");
      const jsonContent = personalizedContent.slice(jsonStart);
      return JSON.parse(jsonContent);
    }
  } catch (error) {
    console.log('Erro na personalização via IA:', error);
  }
  
  return baseStructure;
}
