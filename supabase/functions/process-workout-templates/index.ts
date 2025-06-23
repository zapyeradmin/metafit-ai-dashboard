
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
      } else {
        console.log('Arquivo de lógica não encontrado, continuando sem ele')
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
        
        if (parsedTemplate && parsedTemplate.structure?.semanas?.[0]?.dias?.length > 0) {
          templates.push(parsedTemplate)
          console.log(`Template processado com sucesso: ${fileName}`)
          processedCount++
        } else {
          console.log(`Template não processado (sem dias válidos): ${fileName}`)
        }
      } catch (error) {
        console.error(`Erro ao processar ${fileName}:`, error.message)
      }
    }

    // Inserir templates no banco se houver algum processado
    if (templates.length > 0) {
      console.log(`Inserindo ${templates.length} templates no banco...`)
      
      try {
        // Usar upsert agora que temos o constraint único
        const { data, error: insertError } = await supabaseClient
          .from('workout_templates')
          .upsert(templates, { 
            onConflict: 'template_name'
          })
          .select()

        if (insertError) {
          console.error('Erro ao inserir templates:', insertError)
          throw insertError
        }

        console.log(`${data?.length || 0} templates inseridos/atualizados com sucesso`)
      } catch (dbError) {
        console.error('Erro de banco de dados:', dbError)
        throw dbError
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Processamento concluído com sucesso',
        templatesProcessed: processedCount,
        templatesValid: templates.length,
        logicProcessed,
        templates: templates.map(t => ({ 
          nome: t.template_name, 
          objetivo: t.goal, 
          nivel: t.experience_level,
          dias: t.structure?.semanas?.[0]?.dias?.length || 0
        }))
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

    // Parsing do conteúdo markdown com melhoria na detecção de dias
    const lines = content.split('\n')
    let structure = { semanas: [{ dias: [] }] }
    let currentDay = null
    let trainingDays = 0
    let focusAreas = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // Melhorar detecção de dias com regex mais abrangente
      const dayMatch = trimmedLine.match(/^(#{1,4}\s*)?(\*{1,2})?(?:Dia\s+\d+|Segunda|Terça|Quarta|Quinta|Sexta|Sábado|Domingo|TREINO|Treino)\b/i)
      
      if (dayMatch) {
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
        console.log(`Novo dia detectado: ${currentDay.nome}`)
        continue
      }
      
      // Detectar grupos musculares com regex mais flexível
      if (trimmedLine.match(/(grupos?\s+musculares?|foco|músculo)/i) && trimmedLine.includes(':')) {
        const groupsText = trimmedLine.split(':')[1]?.trim()
        if (groupsText && currentDay) {
          const muscleGroups = groupsText.split(/[,;]/).map(g => g.trim()).filter(g => g.length > 0)
          currentDay.grupos_musculares = muscleGroups
          focusAreas.push(...muscleGroups)
        }
        continue
      }
      
      // Detectar exercícios com regex mais abrangente
      const exerciseMatch = trimmedLine.match(/^(\d+[\.\)]\s*|[-*•]\s*|[\w\s]+:\s*)/i)
      
      if (exerciseMatch && currentDay && trimmedLine.length > 3) {
        const exerciseText = trimmedLine
          .replace(/^\d+[\.\)]\s*/, '')
          .replace(/^[-*•]\s*/, '')
          .trim()
        
        const exerciseParts = exerciseText.split(/[:;]/)
        const exerciseName = exerciseParts[0]?.trim()
        const exerciseDetails = exerciseParts[1]?.trim() || ''
        
        if (exerciseName && exerciseName.length > 2) {
          // Extrair informações de séries e repetições do nome/detalhes
          let series = 3
          let repeticoes = '10-12'
          let descanso = 60
          
          // Procurar por padrões como "3x12", "4 séries", etc.
          const seriesMatch = exerciseText.match(/(\d+)\s*[x×]\s*(\d+)/i)
          if (seriesMatch) {
            series = parseInt(seriesMatch[1])
            repeticoes = seriesMatch[2]
          }
          
          currentDay.exercicios.push({
            nome: exerciseName,
            series,
            repeticoes,
            descanso,
            observacoes: exerciseDetails
          })
          
          console.log(`Exercício adicionado: ${exerciseName}`)
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

    console.log(`Template processado: ${template.template_name}, dias: ${structure.semanas[0].dias.length}, exercícios total: ${structure.semanas[0].dias.reduce((acc, dia) => acc + dia.exercicios.length, 0)}`)
    return template

  } catch (error) {
    console.error(`Erro detalhado ao processar ${fileName}:`, error.message)
    return null
  }
}
