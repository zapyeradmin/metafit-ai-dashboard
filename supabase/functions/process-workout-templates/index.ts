
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

    // Primeiro, carregar a lógica de processamento
    const logicUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/workout-templates-training/logica_de_processamento_dos_treinos.JSON`
    const logicResponse = await fetch(logicUrl)
    
    if (!logicResponse.ok) {
      throw new Error(`Erro ao carregar lógica: ${logicResponse.status}`)
    }
    
    const logic = await logicResponse.json()
    console.log('Lógica carregada:', logic)

    let processedCount = 0
    const templates = []

    // Processar cada template
    for (const fileName of templateFiles) {
      try {
        const fileUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/workout-templates-training/${fileName}`
        const response = await fetch(fileUrl)
        
        if (!response.ok) {
          console.log(`Arquivo não encontrado: ${fileName}`)
          continue
        }

        const content = await response.text()
        const parsedTemplate = parseMarkdownTemplate(content, fileName)
        
        if (parsedTemplate) {
          templates.push(parsedTemplate)
          console.log(`Template processado: ${fileName}`)
          processedCount++
        }
      } catch (error) {
        console.error(`Erro ao processar ${fileName}:`, error)
      }
    }

    // Inserir templates no banco
    if (templates.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('workout_templates')
        .upsert(templates, { 
          onConflict: 'template_name',
          ignoreDuplicates: false 
        })

      if (insertError) {
        console.error('Erro ao inserir templates:', insertError)
        throw insertError
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Templates processados com sucesso',
        templatesProcessed: processedCount,
        templates: templates.map(t => ({ name: t.template_name, goal: t.goal, level: t.experience_level }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro no processamento:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
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
    // Extrair metadados do nome do arquivo
    const nameParts = fileName.replace('.md', '').split('_')
    let goal = 'geral'
    let level = 'iniciante'
    
    if (nameParts.includes('emagrecimento')) goal = 'emagrecimento'
    if (nameParts.includes('hipertrofia')) goal = 'hipertrofia'
    if (nameParts.includes('core') || nameParts.includes('mobilidade')) goal = 'core_mobilidade'
    
    if (nameParts.includes('iniciante')) level = 'iniciante'
    if (nameParts.includes('intermediario')) level = 'intermediario'
    if (nameParts.includes('avancado')) level = 'avançado'
    if (nameParts.includes('elite')) level = 'elite'

    // Parsing básico do conteúdo markdown
    const lines = content.split('\n')
    let currentSection = ''
    let structure = { semanas: [{ dias: [] }] }
    let currentDay = null
    let trainingDays = 0
    let focusAreas = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('# ')) {
        currentSection = trimmedLine.substring(2)
      }
      
      if (trimmedLine.startsWith('## Dia ') || trimmedLine.startsWith('**Dia ')) {
        if (currentDay) {
          structure.semanas[0].dias.push(currentDay)
        }
        
        currentDay = {
          dia: trimmedLine.replace(/[#*]/g, '').trim(),
          nome: trimmedLine.replace(/[#*]/g, '').trim(),
          grupos_musculares: [],
          exercicios: []
        }
        trainingDays++
      }
      
      if (trimmedLine.includes('**Grupos Musculares:**') || trimmedLine.includes('**Foco:**')) {
        const nextLineIndex = lines.indexOf(line) + 1
        if (nextLineIndex < lines.length) {
          const muscleGroups = lines[nextLineIndex].trim().split(',').map(g => g.trim())
          if (currentDay) {
            currentDay.grupos_musculares = muscleGroups
          }
          focusAreas = [...focusAreas, ...muscleGroups]
        }
      }
      
      if (trimmedLine.match(/^\d+\.\s/)) {
        const exerciseName = trimmedLine.replace(/^\d+\.\s/, '').split(':')[0].trim()
        const exerciseDetails = trimmedLine.includes(':') ? trimmedLine.split(':')[1].trim() : ''
        
        if (currentDay) {
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
    
    if (currentDay) {
      structure.semanas[0].dias.push(currentDay)
    }

    return {
      template_name: fileName.replace('.md', ''),
      goal,
      experience_level: level,
      training_days_per_week: Math.min(trainingDays, 7),
      focus_areas: [...new Set(focusAreas)].slice(0, 5),
      structure
    }

  } catch (error) {
    console.error(`Erro ao fazer parse do template ${fileName}:`, error)
    return null
  }
}
