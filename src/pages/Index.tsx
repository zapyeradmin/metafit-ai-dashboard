import React from 'react';
import { ProgressChart } from '../components/ProgressChart';
import { WeeklyChart } from '../components/WeeklyChart';

const Index = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Olá Rafael, bem-vindo ao seu painel de controle fitness.</p>
        </div>
        
        {/* Date and Weather */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="text-sm text-gray-600">
            <span>Quinta-feira, 12 de Junho de 2025</span>
          </div>
          <div className="flex items-center mt-2 sm:mt-0 px-3 py-1 bg-white rounded-lg shadow-sm">
            <div className="w-5 h-5 flex items-center justify-center mr-2">
              <i className="ri-sun-line text-yellow-500"></i>
            </div>
            <span className="text-sm text-gray-600">28°C - São Paulo</span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Progresso Geral</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-line-chart-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-32 h-32">
                <ProgressChart />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-gray-900">68%</p>
              <p className="text-sm text-gray-600">do objetivo alcançado</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Próximo Treino</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-calendar-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-900">Treino de Costas</h4>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                  <i className="ri-time-line"></i>
                </div>
                <span>Hoje, 18:30</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center mr-1">
                  <i className="ri-map-pin-line"></i>
                </div>
                <span>Academia Central</span>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
              Ver Detalhes
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Plano Alimentar</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-restaurant-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="custom-checkbox flex items-center">
                    <input type="checkbox" checked readOnly />
                    <span className="checkmark"></span>
                    <span className="ml-7 text-sm text-gray-600">Café da manhã</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="custom-checkbox flex items-center">
                    <input type="checkbox" checked readOnly />
                    <span className="checkmark"></span>
                    <span className="ml-7 text-sm text-gray-600">Lanche da manhã</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="custom-checkbox flex items-center">
                    <input type="checkbox" readOnly />
                    <span className="checkmark"></span>
                    <span className="ml-7 text-sm text-gray-600">Almoço</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <label className="custom-checkbox flex items-center">
                    <input type="checkbox" readOnly />
                    <span className="checkmark"></span>
                    <span className="ml-7 text-sm text-gray-600">Lanche da tarde</span>
                  </label>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
              Ver Plano Completo
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Métricas</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary bg-opacity-10">
                <i className="ri-scales-line text-primary"></i>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Peso Atual</p>
                  <p className="text-sm font-medium text-gray-900">78.5 kg</p>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">% Gordura</p>
                  <p className="text-sm font-medium text-gray-900">14.2%</p>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Massa Magra</p>
                  <p className="text-sm font-medium text-gray-900">67.3 kg</p>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary rounded-button hover:bg-primary/90 whitespace-nowrap">
              Atualizar Medidas
            </button>
          </div>
        </div>

        {/* Weekly Summary and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Resumo Semanal</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">Esta Semana</button>
                  <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap">Mês</button>
                </div>
              </div>
              <div className="h-72">
                <WeeklyChart />
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                <button className="text-sm text-primary hover:text-primary/80">Ver todas</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 flex-shrink-0">
                    <i className="ri-calendar-check-line text-blue-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Atualização do Plano</p>
                    <p className="text-xs text-gray-600">Seu novo plano de treino está disponível para a próxima semana.</p>
                    <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                    <i className="ri-trophy-line text-green-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Meta Alcançada!</p>
                    <p className="text-xs text-gray-600">Você atingiu sua meta de treinos semanais. Continue assim!</p>
                    <p className="text-xs text-gray-500 mt-1">Ontem</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 flex-shrink-0">
                    <i className="ri-restaurant-line text-yellow-600"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Ajuste Nutricional</p>
                    <p className="text-xs text-gray-600">Seu plano alimentar foi ajustado com base nos seus últimos resultados.</p>
                    <p className="text-xs text-gray-500 mt-1">2 dias atrás</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Próximos Treinos</h3>
              <button className="text-sm text-primary hover:text-primary/80">Ver todos</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary bg-opacity-10 flex-shrink-0">
                  <i className="ri-run-line text-primary"></i>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">Treino de Costas</p>
                    <p className="text-xs text-gray-600">Hoje</p>
                  </div>
                  <p className="text-xs text-gray-600">18:30 - Academia Central</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary bg-opacity-10 flex-shrink-0">
                  <i className="ri-heart-pulse-line text-primary"></i>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">Treino de Pernas</p>
                    <p className="text-xs text-gray-600">Amanhã</p>
                  </div>
                  <p className="text-xs text-gray-600">19:00 - Academia Central</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary bg-opacity-10 flex-shrink-0">
                  <i className="ri-boxing-line text-primary"></i>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">Treino de Peito</p>
                    <p className="text-xs text-gray-600">Sexta-feira</p>
                  </div>
                  <p className="text-xs text-gray-600">18:30 - Academia Central</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Dicas Nutricionais</h3>
              <button className="text-sm text-primary hover:text-primary/80">Ver todas</button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Proteínas para Hipertrofia</h4>
                <p className="mt-1 text-xs text-gray-600">Consuma entre 1.6g e 2.2g de proteína por kg de peso corporal para maximizar o ganho de massa muscular.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Hidratação Adequada</h4>
                <p className="mt-1 text-xs text-gray-600">Beba pelo menos 3 litros de água por dia para manter o metabolismo ativo e a recuperação muscular eficiente.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Carboidratos Estratégicos</h4>
                <p className="mt-1 text-xs text-gray-600">Concentre o consumo de carboidratos nas refeições pré e pós-treino para maximizar a energia e recuperação.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
