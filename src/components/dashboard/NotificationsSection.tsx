
import React from 'react';

const NotificationsSection = () => {
  return (
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
  );
};

export default NotificationsSection;
