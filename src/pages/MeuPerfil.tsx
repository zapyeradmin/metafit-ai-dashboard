
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const MeuPerfil = () => {
  const { profile, updateProfile, loading } = useProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    gender: '',
    height: '',
    current_weight: '',
    goal_weight: '',
    fitness_goal: '',
    activity_level: '',
    gym_name: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || '',
        height: profile.height?.toString() || '',
        current_weight: profile.current_weight?.toString() || '',
        goal_weight: profile.goal_weight?.toString() || '',
        fitness_goal: profile.fitness_goal || '',
        activity_level: profile.activity_level || '',
        gym_name: profile.gym_name || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      full_name: formData.full_name,
      birth_date: formData.birth_date,
      gender: formData.gender,
      height: formData.height ? parseInt(formData.height) : null,
      current_weight: formData.current_weight ? parseFloat(formData.current_weight) : null,
      goal_weight: formData.goal_weight ? parseFloat(formData.goal_weight) : null,
      fitness_goal: formData.fitness_goal,
      activity_level: formData.activity_level,
      gym_name: formData.gym_name
    };

    await updateProfile(updateData);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-1 text-sm text-gray-600">Gerencie suas informações pessoais e preferências.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Profile Header */}
          <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
              alt="Perfil" 
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {formData.full_name || 'Usuário'}
              </h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <Button variant="outline" size="sm" className="mt-2">
                Alterar Foto
              </Button>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <Input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academia
                  </label>
                  <Input
                    name="gym_name"
                    value={formData.gym_name}
                    onChange={handleChange}
                    placeholder="Nome da sua academia"
                  />
                </div>
              </div>
            </div>

            {/* Informações Físicas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Físicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <Input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso Atual (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    name="current_weight"
                    value={formData.current_weight}
                    onChange={handleChange}
                    placeholder="70.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso Meta (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    name="goal_weight"
                    value={formData.goal_weight}
                    onChange={handleChange}
                    placeholder="75.0"
                  />
                </div>
              </div>
            </div>

            {/* Objetivos e Atividade */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos e Atividade</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo Principal
                  </label>
                  <select
                    name="fitness_goal"
                    value={formData.fitness_goal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione seu objetivo</option>
                    <option value="hipertrofia">Hipertrofia</option>
                    <option value="emagrecimento">Emagrecimento</option>
                    <option value="resistencia">Resistência</option>
                    <option value="manutencao">Manutenção</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade
                  </label>
                  <select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="sedentario">Sedentário</option>
                    <option value="leve">Atividade Leve</option>
                    <option value="moderado">Atividade Moderada</option>
                    <option value="intenso">Atividade Intensa</option>
                    <option value="muito_intenso">Muito Intenso</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>

        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                <i className="ri-calendar-line text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Membro desde</p>
                <p className="text-lg font-bold text-gray-900">
                  {profile?.created_at ? 
                    new Date(profile.created_at).toLocaleDateString('pt-BR') : 
                    'Hoje'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                <i className="ri-target-line text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">IMC Atual</p>
                <p className="text-lg font-bold text-gray-900">
                  {formData.height && formData.current_weight ? 
                    (parseFloat(formData.current_weight) / Math.pow(parseInt(formData.height) / 100, 2)).toFixed(1) :
                    '--'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100">
                <i className="ri-trophy-line text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Objetivo</p>
                <p className="text-lg font-bold text-gray-900">
                  {formData.fitness_goal ? 
                    formData.fitness_goal.charAt(0).toUpperCase() + formData.fitness_goal.slice(1) :
                    'Definir'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;
