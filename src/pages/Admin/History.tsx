import React from 'react';
import { Calendar, MessageSquare, FileText, Clock } from 'lucide-react';
import { Card } from '../../components/Card';

export function History() {
  const activities = [
    {
      id: 1,
      type: 'chat',
      title: 'Conversa com Assistente Virtual',
      description: 'Discussão sobre rotinas e atividades',
      date: '2024-03-15T14:30:00',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Consulta com Dra. Maria Silva',
      description: 'Terapia Ocupacional - Avaliação Inicial',
      date: '2024-03-14T10:00:00',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 3,
      type: 'document',
      title: 'Relatório de Progresso',
      description: 'Avaliação mensal de desenvolvimento',
      date: '2024-03-13T16:45:00',
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Histórico de Atividades</h1>
        <p className="mt-2 text-gray-600">
          Acompanhe todas as interações, consultas e documentos dos usuários
        </p>
      </div>

      <div className="grid gap-6">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  {activity.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activity.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(activity.date)}
                  </div>
                </div>
                <p className="mt-1 text-gray-600">{activity.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma atividade registrada ainda.</p>
        </div>
      )}
    </div>
  );
}