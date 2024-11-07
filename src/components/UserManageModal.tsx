import React, { useState } from 'react';
import { X, Save, Trash2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { User as DBUser } from '../database/setup';
import { initDB } from '../database/setup';
import { ChangePassword } from './ChangePassword';

interface UserManageModalProps {
  user?: DBUser & {
    subscription?: {
      id?: string;
      plan: string;
      status: string;
    };
  };
  onClose: () => void;
  onUpdate: () => void;
  isAdmin: boolean;
}

export function UserManageModal({ user, onClose, onUpdate, isAdmin }: UserManageModalProps) {
  const isCreating = !user;
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    userType: user?.userType || 'parent',
    agentLevel: user?.agentLevel || 1,
    subscription: {
      plan: user?.subscription?.plan || 'basic',
      status: user?.subscription?.status || 'inactive'
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('subscription.')) {
      const subscriptionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          [subscriptionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (isCreating) {
      if (!formData.password) {
        throw new Error('A senha é obrigatória');
      }
      if (formData.password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      validateForm();

      const db = await initDB();
      const transaction = db.transaction(['users', 'subscriptions'], 'readwrite');
      const userStore = transaction.objectStore('users');
      const subscriptionStore = transaction.objectStore('subscriptions');

      // Create or update user
      const userId = user?.id || uuidv4();
      const updatedUser = {
        ...user,
        id: userId,
        name: formData.name,
        email: formData.email,
        password: isCreating ? formData.password : user?.password,
        userType: formData.userType,
        agentLevel: formData.userType === 'agent' ? formData.agentLevel : undefined,
        createdAt: user?.createdAt || new Date(),
      };

      await new Promise<void>((resolve, reject) => {
        const request = isCreating ? userStore.add(updatedUser) : userStore.put(updatedUser);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Handle subscription
      if (isCreating) {
        const newSubscription = {
          id: uuidv4(),
          userId,
          plan: formData.subscription.plan,
          status: formData.subscription.status,
          createdAt: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };
        await new Promise<void>((resolve, reject) => {
          const request = subscriptionStore.add(newSubscription);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } else {
        const subscriptionIndex = subscriptionStore.index('userId');
        const subscriptionRequest = subscriptionIndex.get(userId);

        await new Promise<void>((resolve) => {
          subscriptionRequest.onsuccess = () => {
            const existingSubscription = subscriptionRequest.result;
            
            if (existingSubscription) {
              const updatedSubscription = {
                ...existingSubscription,
                plan: formData.subscription.plan,
                status: formData.subscription.status,
              };
              subscriptionStore.put(updatedSubscription);
            } else {
              const newSubscription = {
                id: uuidv4(),
                userId,
                plan: formData.subscription.plan,
                status: formData.subscription.status,
                createdAt: new Date(),
                nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              };
              subscriptionStore.add(newSubscription);
            }
            resolve();
          };
        });
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      setSaving(true);
      const db = await initDB();
      const transaction = db.transaction(['users', 'subscriptions'], 'readwrite');
      const userStore = transaction.objectStore('users');
      const subscriptionStore = transaction.objectStore('subscriptions');

      if (user?.id) {
        // Delete subscription first if exists
        const subscriptionIndex = subscriptionStore.index('userId');
        const subscriptionRequest = subscriptionIndex.get(user.id);
        
        await new Promise<void>((resolve) => {
          subscriptionRequest.onsuccess = () => {
            const subscription = subscriptionRequest.result;
            if (subscription) {
              subscriptionStore.delete(subscription.id);
            }
            resolve();
          };
        });

        // Then delete user
        await new Promise<void>((resolve, reject) => {
          const request = userStore.delete(user.id!);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      onUpdate();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isCreating ? 'Novo Usuário' : 'Gerenciar Usuário'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {isCreating && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Usuário
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="parent">Pai/Responsável</option>
              <option value="professional">Profissional</option>
              {isAdmin && <option value="admin">Administrador</option>}
              {isAdmin && <option value="agent">Agente</option>}
            </select>
          </div>

          {formData.userType === 'agent' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível do Agente
              </label>
              <select
                name="agentLevel"
                value={formData.agentLevel}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5].map(level => (
                  <option key={level} value={level}>
                    Nível {level}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assinatura</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plano
                </label>
                <select
                  name="subscription.plan"
                  value={formData.subscription.plan}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="professional">Profissional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="subscription.status"
                  value={formData.subscription.status}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="overdue">Em Atraso</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          {!isCreating && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showChangePassword ? 'Cancelar Alteração de Senha' : 'Alterar Senha'}
              </button>

              {showChangePassword && user?.id && (
                <ChangePassword
                  userId={user.id}
                  onSuccess={() => setShowChangePassword(false)}
                  className="mt-4"
                />
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          {isAdmin && !isCreating && (
            <button
              onClick={handleDelete}
              className={`flex items-center px-4 py-2 rounded-md ${
                isDeleting
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-red-600 text-red-600 hover:bg-red-50'
              }`}
              disabled={saving}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Confirmar Exclusão' : 'Excluir Usuário'}
            </button>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : isCreating ? 'Criar Usuário' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}