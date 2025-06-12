
import { useState, useEffect } from "react";
import { ProgressChart } from "@/components/ProgressChart";
import { WeeklyChart } from "@/components/WeeklyChart";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: "ri-dashboard-line", label: "Dashboard", active: true },
    { icon: "ri-calendar-line", label: "Plano do Dia" },
    { icon: "ri-line-chart-line", label: "Meu Progresso" },
    { icon: "ri-shield-star-line", label: "Dashboard PRO" },
    { icon: "ri-file-list-3-line", label: "Meus Dados" },
    { icon: "ri-robot-line", label: "Assistente IA" },
    { icon: "ri-settings-3-line", label: "Configuração" },
    { icon: "ri-user-line", label: "Meu Perfil" },
  ];

  const notifications = [
    {
      icon: "ri-calendar-check-line",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Atualização do Plano",
      description: "Seu novo plano de treino está disponível para a próxima semana.",
      time: "Há 2 horas",
    },
    {
      icon: "ri-trophy-line",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Meta Alcançada!",
      description: "Você atingiu sua meta de treinos semanais. Continue assim!",
      time: "Ontem",
    },
    {
      icon: "ri-restaurant-line",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Ajuste Nutricional",
      description: "Seu plano alimentar foi ajustado com base nos seus últimos resultados.",
      time: "2 dias atrás",
    },
  ];

  const upcomingWorkouts = [
    {
      icon: "ri-run-line",
      title: "Treino de Costas",
      time: "Hoje",
      location: "18:30 - Academia Central",
    },
    {
      icon: "ri-heart-pulse-line",
      title: "Treino de Pernas",
      time: "Amanhã",
      location: "19:00 - Academia Central",
    },
    {
      icon: "ri-boxing-line",
      title: "Treino de Peito",
      time: "Sexta-feira",
      location: "18:30 - Academia Central",
    },
  ];

  const nutritionTips = [
    {
      title: "Proteínas para Hipertrofia",
      description: "Consuma entre 1.6g e 2.2g de proteína por kg de peso corporal para maximizar o ganho de massa muscular.",
    },
    {
      title: "Hidratação Adequada",
      description: "Beba pelo menos 3 litros de água por dia para manter o metabolismo ativo e a recuperação muscular eficiente.",
    },
    {
      title: "Carboidratos Estratégicos",
      description: "Concentre o consumo de carboidratos nas refeições pré e pós-treino para maximizar a energia e recuperação.",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-inter">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-2xl font-pacifico text-[#4F46E5]">MetaFit AI</h1>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center px-4 py-3 rounded-lg ${
                  item.active
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  <i className={`${item.icon} ${item.active ? "text-[#4F46E5]" : ""}`}></i>
                </div>
                <span className={item.active ? "font-medium" : ""}>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Perfil"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Rafael Oliveira</p>
              <p className="text-xs text-gray-500">Plano Hipertrofia</p>
            </div>
          </div>
          <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-button hover:bg-gray-200">
            <div className="w-4 h-4 flex items-center justify-center mr-2">
              <i className="ri-logout-box-line"></i>
            </div>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-600 focus:outline-none"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-menu-line"></i>
                  </div>
                </button>
                <h1 className="ml-3 text-xl font-pacifico text-[#4F46E5]">MetaFit AI</h1>
              </div>
              <div className="flex-1 flex justify-end">
                <div className="ml-4 flex items-center md:ml-6">
                  <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-notification-3-line"></i>
                    </div>
                  </button>
                  <div className="ml-3 relative">
                    <div className="md:hidden">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                        alt="Perfil"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Olá Rafael, bem-vindo ao seu painel de controle fitness.
              </p>
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
              {/* Progress Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Progresso Geral</h3>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4F46E5] bg-opacity-10">
                    <i className="ri-line-chart-line text-[#4F46E5]"></i>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <ProgressChart />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">68%</p>
                  <p className="text-sm text-gray-600">do objetivo alcançado</p>
                </div>
              </div>

              {/* Next Workout Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Próximo Treino</h3>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4F46E5] bg-opacity-10">
                    <i className="ri-calendar-line text-[#4F46E5]"></i>
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
                <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-[#4F46E5] rounded-button hover:bg-[#4F46E5]/90">
                  Ver Detalhes
                </button>
              </div>

              {/* Meal Plan Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Plano Alimentar</h3>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4F46E5] bg-opacity-10">
                    <i className="ri-restaurant-line text-[#4F46E5]"></i>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="space-y-3">
                    {["Café da manhã", "Lanche da manhã", "Almoço", "Lanche da tarde"].map((meal, index) => (
                      <div key={index} className="flex items-center">
                        <label className="custom-checkbox flex items-center">
                          <input type="checkbox" defaultChecked={index < 2} />
                          <span className="checkmark"></span>
                          <span className="ml-7 text-sm text-gray-600">{meal}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-[#4F46E5] rounded-button hover:bg-[#4F46E5]/90">
                  Ver Plano Completo
                </button>
              </div>

              {/* Metrics Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Métricas</h3>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4F46E5] bg-opacity-10">
                    <i className="ri-scales-line text-[#4F46E5]"></i>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Peso Atual", value: "78.5 kg", progress: 75 },
                    { label: "% Gordura", value: "14.2%", progress: 60 },
                    { label: "Massa Magra", value: "67.3 kg", progress: 85 },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{metric.label}</p>
                        <p className="text-sm font-medium text-gray-900">{metric.value}</p>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4F46E5] rounded-full"
                          style={{ width: `${metric.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-[#4F46E5] rounded-button hover:bg-[#4F46E5]/90">
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
                      <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">
                        Esta Semana
                      </button>
                      <button className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200">
                        Mês
                      </button>
                    </div>
                  </div>
                  <WeeklyChart />
                </div>
              </div>

              <div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                    <button className="text-sm text-[#4F46E5] hover:text-[#4F46E5]/80">Ver todas</button>
                  </div>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div key={index} className="flex items-start">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${notification.iconBg} flex-shrink-0`}>
                          <i className={`${notification.icon} ${notification.iconColor}`}></i>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600">{notification.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Workouts and Nutrition Tips */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Próximos Treinos</h3>
                  <button className="text-sm text-[#4F46E5] hover:text-[#4F46E5]/80">Ver todos</button>
                </div>
                <div className="space-y-4">
                  {upcomingWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#4F46E5] bg-opacity-10 flex-shrink-0">
                        <i className={`${workout.icon} text-[#4F46E5]`}></i>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{workout.title}</p>
                          <p className="text-xs text-gray-600">{workout.time}</p>
                        </div>
                        <p className="text-xs text-gray-600">{workout.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dicas Nutricionais</h3>
                  <button className="text-sm text-[#4F46E5] hover:text-[#4F46E5]/80">Ver todas</button>
                </div>
                <div className="space-y-4">
                  {nutritionTips.map((tip, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">{tip.title}</h4>
                      <p className="mt-1 text-xs text-gray-600">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
