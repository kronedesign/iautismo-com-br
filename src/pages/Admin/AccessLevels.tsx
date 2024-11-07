import React, { useState } from 'react';
import { Shield, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';

interface AccessLevel {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export function AccessLevels() {
  const [levels, setLevels] = useState<AccessLevel[]>([
    {
      id: 1,
      name: 'Administrador',
      description: 'Acesso total ao sistema',
      permissions: [
        'Gerenciar usuários',
        'Gerenciar níveis de acesso',
        'Gerenciar assinaturas',
        'Visualizar relatórios',
        'Excluir registros'
      ]
    },
    {
      id: 2,
      name: 'Agente Nível 5',
      description: 'Agente sênior com permissões avançadas',
      permissions: [
        'Atender usuários',
        'Gerenciar casos',
        'Criar relatórios',
        'Supervisionar agentes júnior'
      ]
    },
    {
      id: 3,
      name: 'Agente Nível 3',
      description: 'Agente pleno com permissões intermediárias',
      permissions: [
        'Atender usuários',
        'Gerenciar casos',
        'Criar relatórios básicos'
      ]
    },
    {
      id: 4,
      name: 'Agente Nível 1',
      description: 'Agente júnior com permissões básicas',
      permissions: [
        'Atender usuários',
        'Visualizar casos'
      ]
    },
    {
      id: 5,
      name: 'Profissional',
      description: 'Especialistas e terapeutas',
      permissions: [
        'Gerenciar próprio perfil',
        'Atender pacientes',
        'Criar relatórios de atendimento'
      ]
    },
    {
      id: 6,
      name: 'Usuário',
      description: 'Pais e responsáveis',
      permissions: [
        'Acessar conteúdo',
        'Interagir com chatbot',
        'Agendar consultas'
      ]
    }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AccessLevel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (level: AccessLevel) => {
    setEditingId(level.id);
    setEditForm(level);
  };

  const handleSave = () => {
    if (!editForm) return;

    try {
      setLevels(prev => prev.map(level => 
        level.id === editForm.id ? editForm : level
      ));
      setEditingId(null);
      setEditForm(null);
      setError(null);
    } catch (err) {
      setError('Erro ao salvar alterações');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
    setError(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Níveis de Acesso</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os níveis de acesso e permissões do sistema
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {levels.map(level => (
          <Card key={level.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  {editingId === level.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nome do Nível
                        </label>
                        <input
                          type="text"
                          value={editForm?.name || ''}
                          onChange={e => setEditForm(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Descrição
                        </label>
                        <input
                          type="text"
                          value={editForm?.description || ''}
                          onChange={e => setEditForm(prev => prev ? {...prev, description: e.target.value} : null)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Permissões
                        </label>
                        <div className="mt-2 space-y-2">
                          {editForm?.permissions.map((permission, index) => (
                            <input
                              key={index}
                              type="text"
                              value={permission}
                              onChange={e => {
                                const newPermissions = [...(editForm?.permissions || [])];
                                newPermissions[index] = e.target.value;
                                setEditForm(prev => prev ? {...prev, permissions: newPermissions} : null);
                              }}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900">{level.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{level.description}</p>
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-700">Permissões:</h4>
                        <ul className="mt-2 space-y-1">
                          {level.permissions.map((permission, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>
                              {permission}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div>
                {editingId === level.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center p-1 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(level)}
                    className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}