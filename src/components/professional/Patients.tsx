import React from 'react';
import { Calendar, Clock, FileText, MoreVertical } from 'lucide-react';

export function Patients() {
  const patients = [
    {
      id: 1,
      name: 'João Silva',
      age: 8,
      parent: 'Maria Silva',
      nextSession: '2024-03-20T10:00:00',
      lastSession: '2024-03-13T10:00:00',
      status: 'Em tratamento'
    },
    {
      id: 2,
      name: 'Ana Santos',
      age: 6,
      parent: 'Carlos Santos',
      nextSession: '2024-03-21T14:30:00',
      lastSession: '2024-03-14T14:30:00',
      status: 'Em tratamento'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Meus Pacientes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie seus pacientes e consultas
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Novo Paciente
          </button>
        </div>

        <div className="space-y-4">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {patient.name}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 ml-4">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {patient.age} anos • Responsável: {patient.parent}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Próxima sessão:{' '}
                      {new Date(patient.nextSession).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      Última sessão:{' '}
                      {new Date(patient.lastSession).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button className="flex items-center px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md">
                  <FileText className="w-4 h-4 mr-2" />
                  Relatórios
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Iniciar Sessão
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}