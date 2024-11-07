import React from 'react';
import { FileText, Download, Calendar, User } from 'lucide-react';

export function Documents() {
  const documents = [
    {
      id: 1,
      title: 'Relatório de Evolução - João Silva',
      type: 'Relatório de Acompanhamento',
      patient: 'João Silva',
      createdAt: '2024-03-15T14:30:00',
      status: 'Finalizado'
    },
    {
      id: 2,
      title: 'Avaliação Inicial - Ana Santos',
      type: 'Avaliação',
      patient: 'Ana Santos',
      createdAt: '2024-03-14T10:00:00',
      status: 'Em elaboração'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie relatórios e documentações
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Novo Documento
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {doc.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{doc.type}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {doc.patient}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  doc.status === 'Finalizado' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}