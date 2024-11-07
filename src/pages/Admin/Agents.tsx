import React, { useState, useEffect } from 'react';
import { Bot, Plus, Edit2, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import { initDB } from '../../database/setup';
import { v4 as uuidv4 } from 'uuid';

interface Agent {
  id: string;
  name: string;
  iframeCode: string;
  level: number;
  createdAt: Date;
}

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    iframeCode: '',
    level: 1
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['agents'], 'readonly');
      const store = transaction.objectStore('agents');
      const request = store.getAll();

      request.onsuccess = () => {
        setAgents(request.result || []);
      };
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim() || !formData.iframeCode.trim()) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const db = await initDB();
      const transaction = db.transaction(['agents'], 'readwrite');
      const store = transaction.objectStore('agents');

      const agent: Agent = {
        id: editingId || uuidv4(),
        name: formData.name,
        iframeCode: formData.iframeCode,
        level: formData.level,
        createdAt: new Date()
      };

      await new Promise<void>((resolve, reject) => {
        const request = editingId ? store.put(agent) : store.add(agent);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await loadAgents();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar agente');
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingId(agent.id);
    setFormData({
      name: agent.name,
      iframeCode: agent.iframeCode,
      level: agent.level
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['agents'], 'readwrite');
      const store = transaction.objectStore('agents');

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await loadAgents();
    } catch (error) {
      setError('Erro ao excluir agente');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      iframeCode: '',
      level: 1
    });
    setError(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Agentes IA</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os agentes de IA disponíveis na plataforma
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agente
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {isCreating && (
        <Card className="mb-6">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Agente
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Ex: Assistente de Rotinas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código do iFrame
              </label>
              <textarea
                value={formData.iframeCode}
                onChange={(e) => setFormData({ ...formData, iframeCode: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Cole o código do iFrame aqui"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nível do Agente
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    Nível {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                {editingId ? 'Atualizar' : 'Criar'} Agente
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">Nível {agent.level}</p>
                    <p className="text-sm text-gray-500">
                      Criado em: {new Date(agent.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(agent)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id)}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-700 font-mono break-all">
                  {agent.iframeCode}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}