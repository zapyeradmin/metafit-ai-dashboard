
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { objetivo_usuario, id_treino_atual, semanas_concluidas } = await req.json()

    console.log('Verificando progressão:', { objetivo_usuario, id_treino_atual, semanas_concluidas })

    // 1. Buscar a trilha de treino correta com base no objetivo
    const { data: trilhaCompleta, error: trilhaError } = await supabase
      .from('workout_progression_logic')
      .select('*')
      .eq('objetivo', objetivo_usuario)
      .order('created_at')

    if (trilhaError) {
      throw new Error(`Erro ao buscar trilha: ${trilhaError.message}`)
    }

    if (!trilhaCompleta || trilhaCompleta.length === 0) {
      return new Response JSON.stringify({
        status: 'ERRO',
        message: `Trilha para objetivo "${objetivo_usuario}" não encontrada.`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      })
    }

    // 2. Encontrar o estágio atual do usuário dentro da trilha
    let estagioAtual = null
    for (const estagio of trilhaCompleta) {
      if (estagio.treino_id === id_treino_atual) {
        estagioAtual = estagio
        break
      }
    }

    // 3. Verificar se encontrou o estágio atual
    if (!estagioAtual) {
      return new Response(JSON.stringify({
        status: 'ERRO',
        message: 'Treino atual não encontrado na lógica de progressão.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404
      })
    }

    console.log('Estágio atual encontrado:', estagioAtual)

    // 4. Comparar as semanas concluídas com a duração definida
    if (semanas_concluidas >= estagioAtual.duracao_semanas) {
      
      // 5. Verificar se há um próximo treino
      if (estagioAtual.proximo_treino_id) {
        // Encontrar o próximo estágio para pegar o nome do arquivo
        let proximoEstagio = null
        for (const estagio of trilhaCompleta) {
          if (estagio.treino_id === estagioAtual.proximo_treino_id) {
            proximoEstagio = estagio
            break
          }
        }

        if (proximoEstagio) {
          return new Response(JSON.stringify({
            status: 'MUDANÇA_DE_TREINO',
            message: `Novo treino é ${proximoEstagio.arquivo}`,
            novoTreinoId: proximoEstagio.treino_id,
            novoTreinoArquivo: proximoEstagio.arquivo,
            novoTreinoNivel: proximoEstagio.nivel,
            novoTreinoDuracao: proximoEstagio.duracao_semanas,
            estagioAtual: estagioAtual,
            proximoEstagio: proximoEstagio
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      } else {
        return new Response(JSON.stringify({
          status: 'CICLO_FINALIZADO',
          message: `Usuário concluiu a trilha de ${objetivo_usuario}.`,
          estagioAtual: estagioAtual
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    } else {
      const semanasRestantes = estagioAtual.duracao_semanas - semanas_concluidas
      return new Response(JSON.stringify({
        status: 'CONTINUAR_TREINO',
        message: `Usuário permanece em ${estagioAtual.arquivo}.`,
        semanasRestantes,
        estagioAtual: estagioAtual
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    console.error('Erro na verificação de progressão:', error)
    return new Response(JSON.stringify({
      status: 'ERRO',
      message: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
