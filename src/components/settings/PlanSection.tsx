
import React from "react";

export default function PlanSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano e Faturamento</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Plano Atual</h4>
            <p className="text-sm text-gray-600">MetaFit AI Pro - R$ 29,90/mês</p>
            <p className="text-xs text-gray-500">Próxima cobrança: 12/07/2025</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Gerenciar
            </button>
            <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
