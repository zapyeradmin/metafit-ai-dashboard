
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Lista de todos os templates a serem processados
    const templateFiles = [
      'workout_core_mobilidade_1.md',
      'workout_core_mobilidade_avancado.md',
      'workout_emagrecimento_avancado_1.md',
      'workout_emagrecimento_avancado_2.md',
      'workout_emagrecimento_avancado_inferiores_1.md',
      'workout_emagrecimento_avancado_inferiores_2.md',
      'workout_emagrecimento_avancado_inferiores_elite.md',
      'workout_emagrecimento_iniciante_1.md',
      'workout_emagrecimento_intermediario_1.md',
      'workout_emagrecimento_intermediario_2.md',
      'workout_emagrecimento_ultra_avancado_1.md',
      'workout_emagrecimento_ultra_avancado_elite_2.md'
    ]

    let processedCount = 0
    const templates = []
    let logicProcessed = false

    // Tentar carregar a lógica (opcional - se falhar, continua sem ela)
    try {
      const logicUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/workout-templates-training/logica_de_processamento_dos_treinos.JSON`
      const logicResponse = await fetch(logicUrl)
      
      if (logicResponse.ok) {
        const logicText = await logicResponse.text()
        console.log('Conteúdo do arquivo de lógica:', logicText.substring(0, 200))
        
        // Tentar fazer parse do JSON
        try {
          const logic = JSON.parse(logicText)
          console.log('Lógica carregada com sucesso:', logic)
          logicProcessed = true
        } catch (parseError) {
          console.log('Arquivo de lógica não é JSON válido, continuando sem ele:', parseError.message)
        }
      }
    } catch (error) {
      console.log('Erro ao carregar lógica (continuando sem ela):', error.message)
    }

    // Processar cada template
    for (const fileName of templateFiles) {
      try {
        const fileUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/workout-templates-training/${fileName}`
        console.log(`Processando: ${fileName}`)
        
        const response = await fetch(fileUrl)
        
        if (!response.ok) {
          console.log(`Arquivo não encontrado: ${fileName} (Status: ${response.status})`)
          continue
        }

        const content = await response.text()
        console.log(`Conteúdo carregado para ${fileName}: ${content.length} caracteres`)
        
        const parsedTemplate = parseMarkdownTemplate(content, fileName)
        
        if (parsedTemplate) {
          templates.push(parsedTemplate)
          console.log(`Template processado com sucesso: ${fileName}`)
          processedCount++
        } else {
          console.log(`Falha ao processar template: ${fileName}`)
        }
      } catch (error) {
        console.error(`Erro ao processar ${fileName}:`, error.message)
      }
    }

    // Inserir templates no banco se houver algum processado
    if (templates.length > 0) {
      console.log(`Inserindo ${templates.length} templates no banco...`)
      
      const { data, error: insertError } = await supabaseClient
        .from('workout_templates')
        .upsert(templates, { 
          onConflict: 'template_name',
          ignoreDuplicates: false 
        })
        .select()

      if (insertError) {
        console.error('Erro ao inserir templates:', insertError)
        throw insertError
      }

      console.log(`Templates inseridos com sucesso:`, data?.length)
    }

    return new Response(
      JSON.stringify({
        message: 'Processamento concluído',
        templatesProcessed: processedCount,
        logicProcessed,
        templates: templates.map(t => ({ 
          nome: t.template_name, 
          objetivo: t.goal, 
          nivel: t.experience_level,
          dias: t.training_days_per_week 
        })),
        details: processedCount === 0 ? 'Nenhum template foi processado com sucesso' : undefined
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro geral no processamento:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message,
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function parseMarkdownTemplate(content: string, fileName: string) {
  try {
    console.log(`Fazendo parse do arquivo: ${fileName}`)
    
    // Extrair metadados do nome do arquivo
    const nameParts = fileName.replace('.md', '').split('_')
    let goal = 'geral'
    let level = 'iniciante'
    
    // Mapear objetivo
    if (nameParts.includes('emagrecimento')) goal = 'emagrecimento'
    if (nameParts.includes('hipertrofia')) goal = 'hipertrofia'
    if (nameParts.includes('core') || nameParts.includes('mobilidade')) goal = 'core_mobilidade'
    
    // Mapear nível
    if (nameParts.includes('iniciante')) level = 'iniciante'
    if (nameParts.includes('intermediario')) level = 'intermediario'  
    if (nameParts.includes('avancado')) level = 'avançado'
    if (nameParts.includes('elite')) level = 'elite'

    // Parsing do conteúdo markdown
    const lines = content.split('\n')
    let structure = { semanas: [{ dias: [] }] }
    let currentDay = null
    let trainingDays = 0
    let focusAreas = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // Detectar início de um novo dia
      if (trimmedLine.match(/^(##+\s*)?(\*\*)?Dia\s+\d+/i) || 
          trimmedLine.match(/^(##+\s*)?(\*\*)?Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo/i)) {
        
        // Salvar dia anterior se existir
        if (currentDay && currentDay.exercicios.length > 0) {
          structure.semanas[0].dias.push(currentDay)
        }
        
        // Criar novo dia
        currentDay = {
          dia: trimmedLine.replace(/[#*]/g, '').trim(),
          nome: trimmedLine.replace(/[#*]/g, '').trim(),
          grupos_musculares: [],
          exercicios: []
        }
        trainingDays++
        continue
      }
      
      // Detectar grupos musculares
      if (trimmedLine.match(/grupos?\s+musculares?|foco/i) && trimmedLine.includes(':')) {
        const groupsText = trimmedLine.split(':')[1]?.trim()
        if (groupsText && currentDay) {
          const muscleGroups = groupsText.split(/[,;]/).map(g => g.trim()).filter(g => g.length > 0)
          currentDay.grupos_musculares = muscleGroups
          focusAreas.push(...muscleGroups)
        }
        continue
      }
      
      // Detectar exercícios (linhas que começam com número ou bullet)
      if (trimmedLine.match(/^\d+[\.\)]\s+/) || trimmedLine.match(/^[-*]\s+\w/)) {
        if (currentDay) {
          const exerciseText = trimmedLine.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*]\s*/, '')
          const exerciseParts = exerciseText.split(/[:;]/)
          
          const exerciseName = exerciseParts[0]?.trim()
          const exerciseDetails = exerciseParts[1]?.trim() || ''
          
          if (exerciseName) {
            currentDay.exercicios.push({
              nome: exerciseName,
              series: 3,
              repeticoes: '10-12',
              descanso: 60,
              observacoes: exerciseDetails
            })
          }
        }
      }
    }
    
    // Adicionar último dia se existir
    if (currentDay && currentDay.exercicios.length > 0) {
      structure.semanas[0].dias.push(currentDay)
    }

    const template = {
      template_name: fileName.replace('.md', ''),
      goal,
      experience_level: level,
      training_days_per_week: Math.min(trainingDays, 7),
      focus_areas: [...new Set(focusAreas)].slice(0, 5),
      structure
    }

    console.log(`Template processado: ${template.template_name}, dias: ${structure.semanas[0].dias.length}`)
    return template

  } catch (error) {
    console.error(`Erro detalhado ao processar ${fileName}:`, error.message)
    return null
  }
}
