
import React, { useState } from 'react';

const AssistenteIA = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá, Rafael! Sou seu assistente de fitness pessoal. Como posso ajudá-lo hoje? Posso criar planos de treino, sugerir ajustes na dieta, ou responder qualquer dúvida sobre fitness.',
      timestamp: '14:30'
    },
    {
      id: 2,
      type: 'user',
      content: 'Estou sentindo que meu treino de peito não está sendo eficiente. Você pode me ajudar?',
      timestamp: '14:32'
    },
    {
      id: 3,
      type: 'assistant',
      content: 'Claro! Analisando seus dados, vejo que você treina peito 2x por semana. Algumas sugestões para melhorar a eficiência:\n\n1. **Aumentar a intensidade**: Tente reduzir o descanso entre séries de 90s para 60s\n2. **Variar os ângulos**: Inclua supino inclinado e declinado\n3. **Foco na conexão mente-músculo**: Execute movimentos mais lentos e controlados\n\nQuer que eu ajuste seu próximo treino de peito?',
      timestamp: '14:33'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const quickActions = [
    { icon: 'ri-calendar-line', label: 'Criar plano de treino', action: 'criar_treino' },
    { icon: 'ri-restaurant-line', label: 'Ajustar dieta', action: 'ajustar_dieta' },
    { icon: 'ri-question-line', label: 'Tirar dúvida', action: 'duvida' },
    { icon: 'ri-bar-chart-line', label: 'Analisar progresso', action: 'analisar_progresso' }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user' as const,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, userMessage]);
      setNewMessage('');
      
      // Simular resposta da IA
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'assistant' as const,
          content: 'Entendi sua pergunta! Estou analisando seus dados para fornecer a melhor resposta personalizada. Um momento...',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      criar_treino: 'Quero criar um novo plano de treino personalizado',
      ajustar_dieta: 'Preciso de ajuda para ajustar minha dieta atual',
      duvida: 'Tenho algumas dúvidas sobre exercícios e técnicas',
      analisar_progresso: 'Gostaria de uma análise do meu progresso atual'
    };
    
    setNewMessage(actionMessages[action as keyof typeof actionMessages] || '');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Assistente IA</h1>
          <p className="mt-1 text-sm text-gray-600">Seu personal trainer virtual, disponível 24/7 para ajudar com treinos, dieta e dúvidas.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary to-purple-600">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <i className="ri-robot-line text-primary text-lg"></i>
              </div>
              <div>
                <h3 className="text-white font-medium">MetaFit AI Assistant</h3>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-white text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-3">Ações rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center p-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className={`${action.icon} w-4 h-4 mr-2`}></i>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-send-plane-line w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-brain-line text-blue-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Análise Inteligente</h3>
            <p className="text-sm text-gray-600">
              Analiso seus dados de treino e progresso para fornecer insights personalizados e recomendações específicas.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-lightbulb-line text-green-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sugestões Personalizadas</h3>
            <p className="text-sm text-gray-600">
              Crio planos de treino e dieta adaptados ao seu perfil, objetivos e preferências pessoais.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-question-answer-line text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Suporte 24/7</h3>
            <p className="text-sm text-gray-600">
              Estou sempre disponível para esclarecer dúvidas sobre exercícios, nutrição e técnicas de treino.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistenteIA;
