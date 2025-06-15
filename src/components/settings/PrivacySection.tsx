
import React from "react";

export default function PrivacySection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacidade e Segurança</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <i className="ri-lock-line text-gray-400 w-5 h-5 mr-3"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alterar Senha</h4>
              <p className="text-sm text-gray-600">Atualize sua senha de acesso</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
            Alterar
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <i className="ri-shield-check-line text-gray-400 w-5 h-5 mr-3"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</h4>
              <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
            Configurar
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <i className="ri-download-line text-gray-400 w-5 h-5 mr-3"></i>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Baixar Meus Dados</h4>
              <p className="text-sm text-gray-600">Exporte todos os seus dados</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white">
            Baixar
          </button>
        </div>
      </div>
    </div>
  );
}
