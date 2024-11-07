import React from 'react';
import { Bot, Star } from 'lucide-react';

export function MyAgents() {
  const agents = [
    {
      id: 1,
      name: 'Assistente Principal',
      level: 5,
      specialty: 'Suporte Geral',
      status: 'active',
      lastInteraction: '2024-03-15T10:30:00'
    },
    {
      id: 2,
      name: 'Especialista em Rotinas',
      level: 4,
      specialty: 'Rotinas e Atividades',
      status: 'active',
      lastInteraction: '2024-03-14T15:45:00'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Meus Agentes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Agentes de IA designados para seu suporte
        </p>
      </div>

      <div className="grid gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {agent.name}
                  </h3>
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center">
                      {[...Array(agent.level)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      Nível {agent.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {agent.specialty}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Conversar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}