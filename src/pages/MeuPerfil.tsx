
import React, { useState } from 'react';

const MeuPerfil = () => {
  const [activeTab, setActiveTab] = useState('pessoal');
  const [profileData, setProfileData] = useState({
    fullName: 'Rafael Oliveira',
    email: 'rafael.oliveira@email.com',
    phone: '+55 11 99999-9999',
    birthDate: '1990-05-15',
    gender: 'masculino',
    height: 175,
    currentWeight: 79.3,
    goalWeight: 82,
    fitnessGoal: 'hipertrofia',
    activityLevel: 'moderado',
    gymName: 'Academia Central'
  });

  const handleInputChange = (field: string, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-1 text-sm text-gray-600">Gerencie suas informações pessoais e objetivos fitness.</p>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                alt="Foto do perfil" 
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs hover:bg-primary/90">
                <i className="ri-camera-line"></i>
              </button>
            </div>
            <div className="ml-6 flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{profileData.fullName}</h2>
              <p className="text-sm text-gray-600">{profileData.email}</p>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-scales-line w-4 h-4 mr-1"></i>
                  <span>{profileData.currentWeight}kg</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-target-line w-4 h-4 mr-1"></i>
                  <span>Meta: {profileData.goalWeight}kg</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="ri-trophy-line w-4 h-4 mr-1"></i>
                  <span className="capitalize">{profileData.fitnessGoal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'pessoal', label: 'Informações Pessoais', icon: 'ri-user-line' },
                { id: 'fisico', label: 'Dados Físicos', icon: 'ri-body-scan-line' },
                { id: 'objetivos', label: 'Objetivos', icon: 'ri-target-line' },
                { id: 'fotos', label: 'Fotos de Progresso', icon: 'ri-image-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} w-4 h-4 mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pessoal' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Academia</label>
                <input
                  type="text"
                  value={profileData.gymName}
                  onChange={(e) => handleInputChange('gymName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nome da sua academia"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fisico' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Dados Físicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profileData.currentWeight}
                  onChange={(e) => handleInputChange('currentWeight', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Meta (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profileData.goalWeight}
                  onChange={(e) => handleInputChange('goalWeight', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Atividade</label>
              <select
                value={profileData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="sedentario">Sedentário (sem exercícios)</option>
                <option value="leve">Atividade Leve (1-3 dias/semana)</option>
                <option value="moderado">Atividade Moderada (3-5 dias/semana)</option>
                <option value="intenso">Atividade Intensa (6-7 dias/semana)</option>
                <option value="muito_intenso">Muito Intenso (2x por dia)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'objetivos' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Objetivos Fitness</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo Principal</label>
                <select
                  value={profileData.fitnessGoal}
                  onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="hipertrofia">Hipertrofia (Ganho de Massa Muscular)</option>
                  <option value="emagrecimento">Emagrecimento</option>
                  <option value="resistencia">Resistência</option>
                  <option value="manutencao">Manutenção</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Meta de Peso</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">{profileData.goalWeight}kg</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({profileData.goalWeight > profileData.currentWeight ? '+' : ''}
                      {(profileData.goalWeight - profileData.currentWeight).toFixed(1)}kg)
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (profileData.currentWeight / profileData.goalWeight) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-2">IMC Atual</h4>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {(profileData.currentWeight / Math.pow(profileData.height / 100, 2)).toFixed(1)}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">Normal</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Baseado em {profileData.height}cm e {profileData.currentWeight}kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fotos' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fotos de Progresso</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <i className="ri-camera-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">Frente</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                  Adicionar Foto
                </button>
              </div>

              <div className="text-center">
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <i className="ri-camera-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">Perfil</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                  Adicionar Foto
                </button>
              </div>

              <div className="text-center">
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <i className="ri-camera-line text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">Costas</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
                  Adicionar Foto
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <i className="ri-information-line text-blue-600 w-5 h-5 mr-2 mt-0.5"></i>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Dicas para fotos de progresso</h4>
                  <ul className="text-sm text-blue-800 mt-1 list-disc list-inside">
                    <li>Tire fotos no mesmo horário do dia</li>
                    <li>Use roupas similares (roupas íntimas ou de treino)</li>
                    <li>Mantenha a mesma iluminação e posição</li>
                    <li>Tire fotos semanalmente ou quinzenalmente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;
