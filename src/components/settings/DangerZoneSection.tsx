
import React from "react";

export default function DangerZoneSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
      <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de Perigo</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-red-900">Deletar Conta</h4>
            <p className="text-sm text-red-600">Esta ação não pode ser desfeita</p>
          </div>
          <button className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
            Deletar Conta
          </button>
        </div>
      </div>
    </div>
  );
}
