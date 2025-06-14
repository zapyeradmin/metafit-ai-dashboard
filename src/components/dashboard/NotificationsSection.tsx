
import React from 'react';
import { DashboardStats } from '../../hooks/useDashboardData';

interface NotificationsSectionProps {
  stats: DashboardStats | null;
}

const NotificationsSection = ({ stats }: NotificationsSectionProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return 'ri-run-line';
      case 'meal':
        return 'ri-restaurant-line';
      case 'measurement':
        return 'ri-scales-line';
      default:
        return 'ri-notification-line';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'text-blue-500 bg-blue-50';
      case 'meal':
        return 'text-green-500 bg-green-50';
      case 'measurement':
        return 'text-purple-500 bg-purple-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
        <button className="text-sm text-primary hover:text-primary/80">Marcar todas como lidas</button>
      </div>
      
      {stats?.notifications && stats.notifications.length > 0 ? (
        <div className="space-y-4">
          {stats.notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                <i className={getNotificationIcon(notification.type)}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mx-auto mb-4">
            <i className="ri-notification-off-line text-gray-400 text-xl"></i>
          </div>
          <p className="text-gray-500">Nenhuma notificação</p>
          <p className="text-xs text-gray-400 mt-1">Você está em dia com tudo!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
