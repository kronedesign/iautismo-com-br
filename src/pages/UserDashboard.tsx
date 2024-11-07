import React, { useState } from 'react';
import { Users, MessageSquare, UserCheck, User } from 'lucide-react';
import { Card } from '../components/Card';
import { MyAgents } from '../components/dashboard/MyAgents';
import { Community } from '../components/dashboard/Community';
import { Professionals } from '../components/dashboard/Professionals';

interface UserDashboardProps {
  onNavigate?: (page: string) => void;
  currentUser?: any;
}

export function UserDashboard({ onNavigate, currentUser }: UserDashboardProps) {
  const [activeSection, setActiveSection] = useState<'agents' | 'community' | 'professionals'>('agents');

  const renderSection = () => {
    switch (activeSection) {
      case 'agents':
        return <MyAgents />;
      case 'community':
        return <Community />;
      case 'professionals':
        return <Professionals />;
      default:
        return <MyAgents />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {currentUser?.name}</h1>
            <p className="mt-2 text-gray-600">Bem-vindo ao seu painel de controle</p>
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {currentUser?.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-red-500 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${
              activeSection === 'agents' ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveSection('agents')}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Meus Agentes</h3>
                <p className="text-sm text-gray-500">Gerencie seus agentes de suporte</p>
              </div>
            </div>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              activeSection === 'community' ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveSection('community')}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Comunidade</h3>
                <p className="text-sm text-gray-500">Interaja com outros usuários</p>
              </div>
            </div>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              activeSection === 'professionals' ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveSection('professionals')}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profissionais</h3>
                <p className="text-sm text-gray-500">Encontre especialistas</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}