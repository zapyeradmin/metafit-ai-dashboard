export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_integrations: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_user_contexts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ai_user_contexts_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      body_measurements: {
        Row: {
          arms: number | null
          body_fat_percentage: number | null
          chest: number | null
          created_at: string
          date: string
          hips: number | null
          id: string
          muscle_mass: number | null
          notes: string | null
          thighs: number | null
          user_id: string
          waist: number | null
          weight: number | null
        }
        Insert: {
          arms?: number | null
          body_fat_percentage?: number | null
          chest?: number | null
          created_at?: string
          date?: string
          hips?: number | null
          id?: string
          muscle_mass?: number | null
          notes?: string | null
          thighs?: number | null
          user_id: string
          waist?: number | null
          weight?: number | null
        }
        Update: {
          arms?: number | null
          body_fat_percentage?: number | null
          chest?: number | null
          created_at?: string
          date?: string
          hips?: number | null
          id?: string
          muscle_mass?: number | null
          notes?: string | null
          thighs?: number | null
          user_id?: string
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      daily_meals: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          date: string
          fat: number | null
          id: string
          is_completed: boolean | null
          meal_type: string | null
          name: string
          notes: string | null
          nutrition_plan_id: string | null
          protein: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          date?: string
          fat?: number | null
          id?: string
          is_completed?: boolean | null
          meal_type?: string | null
          name: string
          notes?: string | null
          nutrition_plan_id?: string | null
          protein?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          date?: string
          fat?: number | null
          id?: string
          is_completed?: boolean | null
          meal_type?: string | null
          name?: string
          notes?: string | null
          nutrition_plan_id?: string | null
          protein?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_meals_nutrition_plan_id_fkey"
            columns: ["nutrition_plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_workouts: {
        Row: {
          created_at: string
          date: string
          duration_minutes: number | null
          generated_by_ai: boolean | null
          id: string
          is_completed: boolean | null
          muscle_groups: string[] | null
          name: string
          notes: string | null
          updated_at: string
          user_id: string
          workout_plan_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          duration_minutes?: number | null
          generated_by_ai?: boolean | null
          id?: string
          is_completed?: boolean | null
          muscle_groups?: string[] | null
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
          workout_plan_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          duration_minutes?: number | null
          generated_by_ai?: boolean | null
          id?: string
          is_completed?: boolean | null
          muscle_groups?: string[] | null
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          workout_plan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_workouts_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          difficulty: string | null
          equipment: string | null
          id: string
          instructions: string | null
          muscle_group: string
          name: string
          progression_type: string | null
          reps_range: string | null
          rest_time_seconds: number | null
          sets_range: string | null
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group: string
          name: string
          progression_type?: string | null
          reps_range?: string | null
          rest_time_seconds?: number | null
          sets_range?: string | null
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          equipment?: string | null
          id?: string
          instructions?: string | null
          muscle_group?: string
          name?: string
          progression_type?: string | null
          reps_range?: string | null
          rest_time_seconds?: number | null
          sets_range?: string | null
        }
        Relationships: []
      }
      nutrition_plans: {
        Row: {
          carbs_grams: number | null
          created_at: string
          daily_calories: number | null
          fat_grams: number | null
          id: string
          is_active: boolean | null
          name: string
          protein_grams: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          carbs_grams?: number | null
          created_at?: string
          daily_calories?: number | null
          fat_grams?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          protein_grams?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          carbs_grams?: number | null
          created_at?: string
          daily_calories?: number | null
          fat_grams?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          protein_grams?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          created_at: string
          credentials: Json | null
          id: string
          is_active: boolean
          name: string
          provider: string
          supported_currencies: string[] | null
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          credentials?: Json | null
          id?: string
          is_active?: boolean
          name: string
          provider: string
          supported_currencies?: string[] | null
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          credentials?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          provider?: string
          supported_currencies?: string[] | null
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          description: string | null
          discount_percent_yearly: number
          features: Json | null
          id: string
          is_active: boolean
          max_users: number | null
          name: string
          price_monthly: number
          price_yearly: number
          resource_limits: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percent_yearly?: number
          features?: Json | null
          id?: string
          is_active?: boolean
          max_users?: number | null
          name: string
          price_monthly?: number
          price_yearly?: number
          resource_limits?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percent_yearly?: number
          features?: Json | null
          id?: string
          is_active?: boolean
          max_users?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          resource_limits?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          current_weight: number | null
          fitness_goal: string | null
          full_name: string | null
          gender: string | null
          goal_weight: number | null
          gym_name: string | null
          height: number | null
          id: string
          is_active: boolean
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level?: string | null
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          current_weight?: number | null
          fitness_goal?: string | null
          full_name?: string | null
          gender?: string | null
          goal_weight?: number | null
          gym_name?: string | null
          height?: number | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string | null
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          current_weight?: number | null
          fitness_goal?: string | null
          full_name?: string | null
          gender?: string | null
          goal_weight?: number | null
          gym_name?: string | null
          height?: number | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_health_data: {
        Row: {
          carbs_frequency: string | null
          created_at: string
          daily_activities: string[] | null
          data_date: string
          diagnosed_conditions: string[] | null
          diagnosed_conditions_other: string | null
          family_health_conditions: string[] | null
          family_health_conditions_other: string | null
          fruits_vegetables_frequency: string | null
          has_physical_limitations: string | null
          id: string
          meals_per_day: string | null
          medication_affects_exercise: string | null
          pain_areas: string[] | null
          physical_limitations_description: string | null
          processed_food_frequency: string | null
          protein_frequency: string | null
          regular_medication: string | null
          relaxation_techniques: string[] | null
          sleep_hours: string | null
          sleep_quality: number | null
          specific_diet: string[] | null
          specific_diet_other: string | null
          stress_rating: number | null
          updated_at: string
          user_id: string
          water_consumption: string | null
        }
        Insert: {
          carbs_frequency?: string | null
          created_at?: string
          daily_activities?: string[] | null
          data_date?: string
          diagnosed_conditions?: string[] | null
          diagnosed_conditions_other?: string | null
          family_health_conditions?: string[] | null
          family_health_conditions_other?: string | null
          fruits_vegetables_frequency?: string | null
          has_physical_limitations?: string | null
          id?: string
          meals_per_day?: string | null
          medication_affects_exercise?: string | null
          pain_areas?: string[] | null
          physical_limitations_description?: string | null
          processed_food_frequency?: string | null
          protein_frequency?: string | null
          regular_medication?: string | null
          relaxation_techniques?: string[] | null
          sleep_hours?: string | null
          sleep_quality?: number | null
          specific_diet?: string[] | null
          specific_diet_other?: string | null
          stress_rating?: number | null
          updated_at?: string
          user_id: string
          water_consumption?: string | null
        }
        Update: {
          carbs_frequency?: string | null
          created_at?: string
          daily_activities?: string[] | null
          data_date?: string
          diagnosed_conditions?: string[] | null
          diagnosed_conditions_other?: string | null
          family_health_conditions?: string[] | null
          family_health_conditions_other?: string | null
          fruits_vegetables_frequency?: string | null
          has_physical_limitations?: string | null
          id?: string
          meals_per_day?: string | null
          medication_affects_exercise?: string | null
          pain_areas?: string[] | null
          physical_limitations_description?: string | null
          processed_food_frequency?: string | null
          protein_frequency?: string | null
          regular_medication?: string | null
          relaxation_techniques?: string[] | null
          sleep_hours?: string | null
          sleep_quality?: number | null
          specific_diet?: string[] | null
          specific_diet_other?: string | null
          stress_rating?: number | null
          updated_at?: string
          user_id?: string
          water_consumption?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_health_data_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_nutrition_preferences: {
        Row: {
          avoid_foods: string[]
          calories_target: number
          carb_target: number
          created_at: string
          diet_goal: string
          dietary_restrictions: string[]
          fat_target: number
          id: string
          preferred_foods: string[]
          protein_target: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avoid_foods: string[]
          calories_target: number
          carb_target: number
          created_at?: string
          diet_goal: string
          dietary_restrictions: string[]
          fat_target: number
          id?: string
          preferred_foods: string[]
          protein_target: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avoid_foods?: string[]
          calories_target?: number
          carb_target?: number
          created_at?: string
          diet_goal?: string
          dietary_restrictions?: string[]
          fat_target?: number
          id?: string
          preferred_foods?: string[]
          protein_target?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_nutrition_preferences_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_physical_data: {
        Row: {
          allergies: string[] | null
          ankle_circumference: number | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          blood_type: string | null
          body_frame: string | null
          body_temperature: number | null
          body_type: string | null
          bone_density: number | null
          created_at: string
          dietary_restrictions: string[] | null
          dominant_hand: string | null
          id: string
          meals_per_day: number | null
          metabolic_age: number | null
          metabolism_type: string | null
          neck_circumference: number | null
          preferred_training_time: string | null
          recovery_time_hours: number | null
          resting_heart_rate: number | null
          sleep_hours_daily: number | null
          stress_level: number | null
          supplements: string[] | null
          training_experience: string | null
          training_frequency: number | null
          updated_at: string
          user_id: string
          visceral_fat_level: number | null
          water_intake_daily: number | null
          wrist_circumference: number | null
        }
        Insert: {
          allergies?: string[] | null
          ankle_circumference?: number | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_type?: string | null
          body_frame?: string | null
          body_temperature?: number | null
          body_type?: string | null
          bone_density?: number | null
          created_at?: string
          dietary_restrictions?: string[] | null
          dominant_hand?: string | null
          id?: string
          meals_per_day?: number | null
          metabolic_age?: number | null
          metabolism_type?: string | null
          neck_circumference?: number | null
          preferred_training_time?: string | null
          recovery_time_hours?: number | null
          resting_heart_rate?: number | null
          sleep_hours_daily?: number | null
          stress_level?: number | null
          supplements?: string[] | null
          training_experience?: string | null
          training_frequency?: number | null
          updated_at?: string
          user_id: string
          visceral_fat_level?: number | null
          water_intake_daily?: number | null
          wrist_circumference?: number | null
        }
        Update: {
          allergies?: string[] | null
          ankle_circumference?: number | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_type?: string | null
          body_frame?: string | null
          body_temperature?: number | null
          body_type?: string | null
          bone_density?: number | null
          created_at?: string
          dietary_restrictions?: string[] | null
          dominant_hand?: string | null
          id?: string
          meals_per_day?: number | null
          metabolic_age?: number | null
          metabolism_type?: string | null
          neck_circumference?: number | null
          preferred_training_time?: string | null
          recovery_time_hours?: number | null
          resting_heart_rate?: number | null
          sleep_hours_daily?: number | null
          stress_level?: number | null
          supplements?: string[] | null
          training_experience?: string | null
          training_frequency?: number | null
          updated_at?: string
          user_id?: string
          visceral_fat_level?: number | null
          water_intake_daily?: number | null
          wrist_circumference?: number | null
        }
        Relationships: []
      }
      user_physical_data_history: {
        Row: {
          allergies: string[] | null
          ankle_circumference: number | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          blood_type: string | null
          body_frame: string | null
          body_temperature: number | null
          body_type: string | null
          bone_density: number | null
          created_at: string
          data_date: string
          dietary_restrictions: string[] | null
          dominant_hand: string | null
          id: string
          meals_per_day: number | null
          metabolic_age: number | null
          metabolism_type: string | null
          neck_circumference: number | null
          preferred_training_time: string | null
          recovery_time_hours: number | null
          resting_heart_rate: number | null
          sleep_hours_daily: number | null
          stress_level: number | null
          supplements: string[] | null
          training_experience: string | null
          training_frequency: number | null
          user_id: string
          visceral_fat_level: number | null
          water_intake_daily: number | null
          wrist_circumference: number | null
        }
        Insert: {
          allergies?: string[] | null
          ankle_circumference?: number | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_type?: string | null
          body_frame?: string | null
          body_temperature?: number | null
          body_type?: string | null
          bone_density?: number | null
          created_at?: string
          data_date?: string
          dietary_restrictions?: string[] | null
          dominant_hand?: string | null
          id?: string
          meals_per_day?: number | null
          metabolic_age?: number | null
          metabolism_type?: string | null
          neck_circumference?: number | null
          preferred_training_time?: string | null
          recovery_time_hours?: number | null
          resting_heart_rate?: number | null
          sleep_hours_daily?: number | null
          stress_level?: number | null
          supplements?: string[] | null
          training_experience?: string | null
          training_frequency?: number | null
          user_id: string
          visceral_fat_level?: number | null
          water_intake_daily?: number | null
          wrist_circumference?: number | null
        }
        Update: {
          allergies?: string[] | null
          ankle_circumference?: number | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          blood_type?: string | null
          body_frame?: string | null
          body_temperature?: number | null
          body_type?: string | null
          bone_density?: number | null
          created_at?: string
          data_date?: string
          dietary_restrictions?: string[] | null
          dominant_hand?: string | null
          id?: string
          meals_per_day?: number | null
          metabolic_age?: number | null
          metabolism_type?: string | null
          neck_circumference?: number | null
          preferred_training_time?: string | null
          recovery_time_hours?: number | null
          resting_heart_rate?: number | null
          sleep_hours_daily?: number | null
          stress_level?: number | null
          supplements?: string[] | null
          training_experience?: string | null
          training_frequency?: number | null
          user_id?: string
          visceral_fat_level?: number | null
          water_intake_daily?: number | null
          wrist_circumference?: number | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          language: string | null
          meal_reminders: boolean | null
          notifications_enabled: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
          webhook_url: string | null
          workout_reminders: boolean | null
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          meal_reminders?: boolean | null
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
          workout_reminders?: boolean | null
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          meal_reminders?: boolean | null
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
          workout_reminders?: boolean | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          gateway_subscription_id: string | null
          id: string
          is_recurring: boolean
          is_trial: boolean
          payment_gateway: string
          period_end: string
          period_start: string
          plan_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          gateway_subscription_id?: string | null
          id?: string
          is_recurring?: boolean
          is_trial?: boolean
          payment_gateway: string
          period_end: string
          period_start: string
          plan_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          gateway_subscription_id?: string | null
          id?: string
          is_recurring?: boolean
          is_trial?: boolean
          payment_gateway?: string
          period_end?: string
          period_start?: string
          plan_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workout_preferences: {
        Row: {
          available_equipment: string[]
          created_at: string
          current_plan_week: number | null
          data_inicio_treino_atual: string | null
          experience_level: string
          focus_areas: string[] | null
          id: string
          injury_considerations: string[] | null
          last_plan_generated: string | null
          objetivo_atual: string | null
          semanas_completadas_no_treino_atual: number | null
          time_per_session: number
          training_days_per_week: number
          treino_atual_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          available_equipment: string[]
          created_at?: string
          current_plan_week?: number | null
          data_inicio_treino_atual?: string | null
          experience_level: string
          focus_areas?: string[] | null
          id?: string
          injury_considerations?: string[] | null
          last_plan_generated?: string | null
          objetivo_atual?: string | null
          semanas_completadas_no_treino_atual?: number | null
          time_per_session: number
          training_days_per_week: number
          treino_atual_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          available_equipment?: string[]
          created_at?: string
          current_plan_week?: number | null
          data_inicio_treino_atual?: string | null
          experience_level?: string
          focus_areas?: string[] | null
          id?: string
          injury_considerations?: string[] | null
          last_plan_generated?: string | null
          objetivo_atual?: string | null
          semanas_completadas_no_treino_atual?: number | null
          time_per_session?: number
          training_days_per_week?: number
          treino_atual_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_workout_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_workout_progress: {
        Row: {
          completado: boolean | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          semana: number
          treino_id: string
          user_id: string
        }
        Insert: {
          completado?: boolean | null
          created_at?: string
          data_fim?: string | null
          data_inicio: string
          id?: string
          semana: number
          treino_id: string
          user_id: string
        }
        Update: {
          completado?: boolean | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          semana?: number
          treino_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_workout_progress_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string
          daily_workout_id: string
          exercise_id: string
          id: string
          is_completed: boolean | null
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number
          weight: number | null
        }
        Insert: {
          created_at?: string
          daily_workout_id: string
          exercise_id: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets: number
          weight?: number | null
        }
        Update: {
          created_at?: string
          daily_workout_id?: string
          exercise_id?: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_daily_workout_id_fkey"
            columns: ["daily_workout_id"]
            isOneToOne: false
            referencedRelation: "daily_workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          name: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_progression_logic: {
        Row: {
          arquivo: string
          created_at: string
          descricao: string | null
          duracao_semanas: number
          id: string
          nivel: string
          objetivo: string
          proximo_treino_id: string | null
          treino_id: string
          updated_at: string
        }
        Insert: {
          arquivo: string
          created_at?: string
          descricao?: string | null
          duracao_semanas: number
          id?: string
          nivel: string
          objetivo: string
          proximo_treino_id?: string | null
          treino_id: string
          updated_at?: string
        }
        Update: {
          arquivo?: string
          created_at?: string
          descricao?: string | null
          duracao_semanas?: number
          id?: string
          nivel?: string
          objetivo?: string
          proximo_treino_id?: string | null
          treino_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      workout_templates: {
        Row: {
          created_at: string
          experience_level: string
          focus_areas: string[] | null
          goal: string
          id: string
          structure: Json
          template_name: string
          training_days_per_week: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          experience_level: string
          focus_areas?: string[] | null
          goal: string
          id?: string
          structure: Json
          template_name: string
          training_days_per_week?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          experience_level?: string
          focus_areas?: string[] | null
          goal?: string
          id?: string
          structure?: Json
          template_name?: string
          training_days_per_week?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_workout_templates_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      v_meal_macros_user_day: {
        Row: {
          date: string | null
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      dashboard_weekly_progress: {
        Args: { p_user_id: string; p_start: string; p_end: string }
        Returns: {
          prog_date: string
          workouts: number
          meals: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
