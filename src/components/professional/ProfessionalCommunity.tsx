import React from 'react';
import { MessageSquare, Users, ThumbsUp } from 'lucide-react';

export function ProfessionalCommunity() {
  const discussions = [
    {
      id: 1,
      title: 'Novas abordagens em Terapia Ocupacional',
      author: 'Dra. Maria Silva',
      specialty: 'Terapeuta Ocupacional',
      replies: 28,
      likes: 45,
      lastActivity: '2024-03-15T14:30:00'
    },
    {
      id: 2,
      title: 'Discussão de caso: Integração Sensorial',
      author: 'Dr. João Santos',
      specialty: 'Psicólogo',
      replies: 15,
      likes: 32,
      lastActivity: '2024-03-14T16:20:00'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Comunidade Profissional</h2>
            <p className="mt-1 text-sm text-gray-500">
              Compartilhe conhecimento com outros profissionais
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Nova Discussão
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {discussion.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  por {discussion.author} • {discussion.specialty}
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {discussion.replies}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {discussion.likes}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                {discussion.replies} participantes
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Ver Discussão
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}