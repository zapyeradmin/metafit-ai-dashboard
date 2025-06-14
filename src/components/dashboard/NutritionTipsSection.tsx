
import React from 'react';

const NutritionTipsSection = () => {
  const tips = [
    {
      id: 1,
      title: "Hidratação",
      description: "Beba pelo menos 2L de água por dia",
      icon: "ri-drop-line",
      color: "text-blue-500 bg-blue-50"
    },
    {
      id: 2,
      title: "Proteína Pós-Treino",
      description: "Consuma proteína em até 30min após o treino",
      icon: "ri-flashlight-line",
      color: "text-orange-500 bg-orange-50"
    },
    {
      id: 3,
      title: "Refeições Regulares",
      description: "Mantenha intervalos de 3-4h entre refeições",
      icon: "ri-time-line",
      color: "text-green-500 bg-green-50"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Dicas de Nutrição</h3>
        <button className="text-sm text-primary hover:text-primary/80">Ver mais dicas</button>
      </div>
      
      <div className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${tip.color}`}>
              <i className={tip.icon}></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{tip.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-primary bg-opacity-5 rounded-lg">
        <div className="flex items-center space-x-2">
          <i className="ri-lightbulb-line text-primary"></i>
          <span className="text-sm font-medium text-gray-900">Dica do Dia</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Coma devagar e mastigue bem os alimentos. Isso ajuda na digestão e aumenta a sensação de saciedade.
        </p>
      </div>
    </div>
  );
};

export default NutritionTipsSection;
