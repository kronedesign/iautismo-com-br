import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, UserCheck, UserX, Mail, UserPlus, Download, Shield, User } from 'lucide-react';
import { Card } from '../../components/Card';
import { UserManageModal } from '../../components/UserManageModal';
import { ExportModal } from '../../components/ExportModal';
import { initDB } from '../../database/setup';
import type { User as DBUser } from '../../database/setup';

interface User extends DBUser {
  subscription?: {
    id: string;
    plan: string;
    status: string;
  };
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isAdmin] = useState(true); // This should be based on actual user role

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['users', 'subscriptions'], 'readonly');
      const userStore = transaction.objectStore('users');
      const subscriptionStore = transaction.objectStore('subscriptions');

      const usersRequest = userStore.getAll();
      
      usersRequest.onsuccess = async () => {
        const usersData = usersRequest.result;
        const usersWithSubscriptions = await Promise.all(
          usersData.map(async (user) => {
            const subscriptionIndex = subscriptionStore.index('userId');
            const subscriptionRequest = subscriptionIndex.get(user.id);
            
            return new Promise<User>((resolve) => {
              subscriptionRequest.onsuccess = () => {
                resolve({
                  ...user,
                  subscription: subscriptionRequest.result || undefined
                });
              };
            });
          })
        );
        
        setUsers(usersWithSubscriptions);
        setFilteredUsers(usersWithSubscriptions);
      };
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os usuários registrados na plataforma
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          {isAdmin && (
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Usuário
            </button>
          )}
          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Lista
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="mb-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      {user.userType === 'admin' ? (
                        <Shield className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user.userType === 'parent' ? 'Pai/Responsável' :
                       user.userType === 'professional' ? 'Profissional' :
                       user.userType === 'admin' ? 'Administrador' : 'Agente'}
                    </div>
                    <div className="text-gray-500">
                      Plano: {user.subscription?.plan || 'N/A'}
                    </div>
                  </div>
                  <div>
                    {user.subscription?.status === 'active' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <UserX className="w-3 h-3 mr-1" />
                        Inativo
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          data={filteredUsers.map(user => ({
            Nome: user.name,
            Email: user.email,
            'Tipo de Usuário': user.userType === 'parent' ? 'Pai/Responsável' :
                              user.userType === 'professional' ? 'Profissional' :
                              user.userType === 'admin' ? 'Administrador' : 'Agente',
            'Data de Registro': user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '',
            Plano: user.subscription?.plan || 'N/A',
            Status: user.subscription?.status === 'active' ? 'Ativo' :
                   user.subscription?.status === 'pending' ? 'Pendente' :
                   user.subscription?.status === 'overdue' ? 'Em Atraso' :
                   user.subscription?.status === 'canceled' ? 'Cancelado' : 'Inativo'
          }))}
        />
      )}

      {(selectedUser || isCreating) && (
        <UserManageModal
          user={selectedUser || undefined}
          onClose={() => {
            setSelectedUser(null);
            setIsCreating(false);
          }}
          onUpdate={loadUsers}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}