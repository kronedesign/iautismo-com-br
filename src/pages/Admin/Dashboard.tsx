import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { Card } from '../../components/Card';
import { Users, Shield, CreditCard, Award, RefreshCw } from 'lucide-react';
import { History } from './History';
import { UsersList } from './Users';
import { AccessLevels } from './AccessLevels';
import { Agents } from './Agents';
import { clearCache, initDB } from '../../database/setup';

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    specialists: 0,
    activeSubscriptions: 0,
    agents: 0
  });

  const loadStats = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction(['users', 'subscriptions', 'agents'], 'readonly');
      const userStore = transaction.objectStore('users');
      const subscriptionStore = transaction.objectStore('subscriptions');
      const agentStore = transaction.objectStore('agents');
      const statusIndex = subscriptionStore.index('status');

      // Create promises for all requests
      const usersPromise = new Promise((resolve, reject) => {
        const request = userStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const subscriptionsPromise = new Promise((resolve, reject) => {
        const request = statusIndex.getAll('active');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      const agentsPromise = new Promise((resolve, reject) => {
        const request = agentStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Wait for all promises to resolve
      const [users, activeSubscriptions, agents] = await Promise.all([
        usersPromise,
        subscriptionsPromise,
        agentsPromise
      ]);

      // Update stats with the results
      setStats({
        users: users.length,
        specialists: users.filter(u => u.userType === 'professional').length,
        agents: agents.length,
        activeSubscriptions: activeSubscriptions.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        users: 0,
        specialists: 0,
        activeSubscriptions: 0,
        agents: 0
      });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefreshCache = async () => {
    setRefreshing(true);
    try {
      await clearCache();
      await initDB();
      await loadStats();
    } catch (error) {
      console.error('Error refreshing cache:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'history':
        return <History />;
      case 'users':
        return <UsersList />;
      case 'access-levels':
        return <AccessLevels />;
      case 'agents':
        return <Agents />;
      case 'dashboard':
      default:
        return (
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <button
                onClick={handleRefreshCache}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Atualizando...' : 'Atualizar Cache'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total de Usuários</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.users}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Especialistas</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.specialists}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Assinaturas Ativas</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      <Shield className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Agentes</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stats.agents}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
}