
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

    // URLs dos templates
    const templateUrls = [
      'workout_core_mobilidade_1.md',
      'workout_core_mobilidade_avancado.md',
      'workout_emagrecimento_avancado_1.md',
      'workout_emagrecimento_avancado_2.md',
      'workout_emagrecimento_avancado_inferiores_1.md',
      'workout_emagrecimento_avancado_inferiores_2.md',
      'workout_emagrecimento_avancado_inferiores_elite.md',
      'workout_emagrecimento_iniciante_1.md',
      'workout_emagrecimento_iniciante_2.md',
      'workout_emagrecimento_intermediario_1.md',
      'workout_emagrecimento_intermediario_2.md',
      'workout_emagrecimento_ultra_avancado_1.md',
      'workout_emagrecimento_ultra_avancado_elite_2.md'
    ]

    const baseUrl = 'https://zdmxtmihlqukfgtdjrce.supabase.co/storage/v1/object/public/workout-templates-training/'
    
    console.log('Iniciando processamento dos templates...')

    // Buscar a lógica de processamento
    const logicResponse = await fetch(`${baseUrl}logica_de_processamento_dos_treinos.JSON`)
    let processingLogic = null
    try {
      processingLogic = await logicResponse.json()
      console.log('Lógica de processamento carregada:', processingLogic)
    } catch (error) {
      console.log('Erro ao carregar lógica de processamento:', error)
    }

    // Processar cada template
    const processedTemplates = []
    
    for (const templateFile of templateUrls) {
      try {
        console.log(`Processando template: ${templateFile}`)
        
        const response = await fetch(`${baseUrl}${templateFile}`)
        if (!response.ok) {
          console.log(`Erro ao buscar ${templateFile}: ${response.status}`)
          continue
        }
        
        const content = await response.text()
        
        // Extrair informações do nome do arquivo
        const fileInfo = extractFileInfo(templateFile)
        
        // Processar o conteúdo markdown
        const structure = parseMarkdownToStructure(content)
        
        // Criar objeto do template
        const template = {
          template_name: fileInfo.name,
          goal: fileInfo.goal,
          experience_level: fileInfo.level,
          training_days_per_week: extractTrainingDays(content),
          focus_areas: extractFocusAreas(content),
          structure: structure
        }
        
        processedTemplates.push(template)
        console.log(`Template processado: ${template.template_name}`)
        
      } catch (error) {
        console.error(`Erro ao processar ${templateFile}:`, error)
      }
    }

    // Inserir templates no banco
    if (processedTemplates.length > 0) {
      const { data, error } = await supabase
        .from('workout_templates')
        .upsert(processedTemplates, { onConflict: 'template_name' })

      if (error) {
        console.error('Erro ao inserir templates:', error)
        throw error
      }

      console.log(`${processedTemplates.length} templates inseridos com sucesso`)
    }

    return new Response(JSON.stringify({
      success: true,
      templatesProcessed: processedTemplates.length,
      templates: processedTemplates.map(t => ({ name: t.template_name, goal: t.goal, level: t.experience_level }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Erro no processamento:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

function extractFileInfo(filename: string) {
  const name = filename.replace('.md', '').replace('workout_', '')
  
  let goal = 'geral'
  let level = 'iniciante'
  
  if (name.includes('emagrecimento')) {
    goal = 'emagrecimento'
  } else if (name.includes('hipertrofia')) {
    goal = 'hipertrofia'
  } else if (name.includes('core')) {
    goal = 'core_mobilidade'
  }
  
  if (name.includes('iniciante')) {
    level = 'iniciante'
  } else if (name.includes('intermediario')) {
    level = 'intermediario'
  } else if (name.includes('avancado') && !name.includes('ultra')) {
    level = 'avançado'
  } else if (name.includes('ultra') || name.includes('elite')) {
    level = 'elite'
  }
  
  return { name, goal, level }
}

function extractTrainingDays(content: string): number {
  // Buscar por padrões que indiquem dias de treino
  const patterns = [
    /(\d+)\s*dias?\s*por\s*semana/i,
    /(\d+)\s*vezes?\s*por\s*semana/i,
    /treino\s*(\d+)x/i
  ]
  
  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      return parseInt(match[1])
    }
  }
  
  // Default baseado no conteúdo
  const dayMatches = content.match(/##\s*(segunda|terça|quarta|quinta|sexta|sábado|domingo)/gi)
  return dayMatches ? Math.min(dayMatches.length, 6) : 5
}

function extractFocusAreas(content: string): string[] {
  const areas = []
  
  if (content.toLowerCase().includes('superior')) areas.push('superiores')
  if (content.toLowerCase().includes('inferior')) areas.push('inferiores')
  if (content.toLowerCase().includes('core')) areas.push('core')
  if (content.toLowerCase().includes('cardio')) areas.push('cardio')
  if (content.toLowerCase().includes('força')) areas.push('força')
  
  return areas.length > 0 ? areas : ['equilibrado']
}

function parseMarkdownToStructure(content: string) {
  const lines = content.split('\n')
  const structure = {
    semanas: [{
      dias: []
    }]
  }
  
  let currentDay = null
  let currentExercises = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Detectar cabeçalhos de dias
    if (trimmed.match(/^##\s*(segunda|terça|quarta|quinta|sexta|sábado)/i)) {
      // Salvar dia anterior se existir
      if (currentDay) {
        structure.semanas[0].dias.push({
          ...currentDay,
          exercicios: currentExercises
        })
      }
      
      // Iniciar novo dia
      const dayName = trimmed.replace(/^##\s*/, '').replace(':', '').trim()
      currentDay = {
        nome: dayName,
        grupos_musculares: extractMuscleGroups(trimmed),
        data: new Date().toISOString().split('T')[0]
      }
      currentExercises = []
    }
    
    // Detectar exercícios (linhas com números ou bullets)
    else if (trimmed.match(/^\d+\.|\*\s*\w+|^\-\s*\w+/) && !trimmed.toLowerCase().includes('descanso')) {
      const exercise = parseExerciseLine(trimmed)
      if (exercise) {
        currentExercises.push(exercise)
      }
    }
  }
  
  // Adicionar último dia
  if (currentDay) {
    structure.semanas[0].dias.push({
      ...currentDay,
      exercicios: currentExercises
    })
  }
  
  return structure
}

function extractMuscleGroups(dayHeader: string): string[] {
  const groups = []
  const header = dayHeader.toLowerCase()
  
  if (header.includes('peito')) groups.push('peito')
  if (header.includes('costas')) groups.push('costas')
  if (header.includes('perna')) groups.push('pernas')
  if (header.includes('ombro')) groups.push('ombros')
  if (header.includes('braço') || header.includes('bíceps') || header.includes('tríceps')) groups.push('braços')
  if (header.includes('core') || header.includes('abdômen')) groups.push('core')
  
  return groups.length > 0 ? groups : ['geral']
}

function parseExerciseLine(line: string) {
  // Remove numeração e bullets
  let exerciseName = line.replace(/^\d+\.|\*|\-/, '').trim()
  
  // Extrair séries e repetições
  let series = 3
  let repeticoes = 12
  
  const seriesMatch = exerciseName.match(/(\d+)\s*x\s*(\d+)/i)
  if (seriesMatch) {
    series = parseInt(seriesMatch[1])
    repeticoes = parseInt(seriesMatch[2])
    exerciseName = exerciseName.replace(/\d+\s*x\s*\d+/i, '').trim()
  }
  
  if (exerciseName.length < 3) return null
  
  return {
    nome: exerciseName,
    series: series,
    repeticoes: repeticoes
  }
}
