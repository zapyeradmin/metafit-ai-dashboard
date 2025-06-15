
import React from "react";

interface AppearanceProps {
  theme: string;
  setTheme: (val: string) => void;
  disabled: boolean;
}

export default function AppearanceSection({ theme, setTheme, disabled }: AppearanceProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aparência</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={disabled}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="auto">Automático</option>
        </select>
      </div>
    </div>
  );
}
