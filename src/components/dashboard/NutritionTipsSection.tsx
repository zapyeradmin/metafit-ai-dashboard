
import React from 'react';

const NutritionTipsSection = () => {
  return (
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
  );
};

export default NutritionTipsSection;
