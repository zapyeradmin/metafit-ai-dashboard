
import React from "react";

interface NotificationProps {
  settings: {
    notifications: boolean;
    emailNotifications: boolean;
    workoutReminders: boolean;
    mealReminders: boolean;
  };
  handleToggle: (setting: keyof typeof settings) => void;
  disabled: boolean;
}

export default function NotificationsSection({
  settings,
  handleToggle,
  disabled,
}: NotificationProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificações Push</h4>
            <p className="text-sm text-gray-600">Receba notificações no aplicativo</p>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle("notifications")}
              disabled={disabled}
            />
            <span className="switch-slider"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
            <p className="text-sm text-gray-600">Receba atualizações por email</p>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
              disabled={disabled}
            />
            <span className="switch-slider"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Lembretes de Treino</h4>
            <p className="text-sm text-gray-600">Receba lembretes dos seus treinos</p>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.workoutReminders}
              onChange={() => handleToggle("workoutReminders")}
              disabled={disabled}
            />
            <span className="switch-slider"></span>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Lembretes de Refeição</h4>
            <p className="text-sm text-gray-600">Receba lembretes das suas refeições</p>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.mealReminders}
              onChange={() => handleToggle("mealReminders")}
              disabled={disabled}
            />
            <span className="switch-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
