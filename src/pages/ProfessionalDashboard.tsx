import React, { useState } from 'react';
import { Users, FileText, MessageSquare } from 'lucide-react';
import { Card } from '../components/Card';
import { Patients } from '../components/professional/Patients';
import { Documents } from '../components/professional/Documents';
import { ProfessionalCommunity } from '../components/professional/ProfessionalCommunity';

interface ProfessionalDashboardProps {
  onNavigate?: (page: string) => void;
  currentUser?: any;
}

export function ProfessionalDashboard({ onNavigate, currentUser }: ProfessionalDashboardProps) {
  const [activeSection, setActiveSection] = useState<'patients' | 'documents' | 'community'>('patients');

  const renderSection = () => {
    switch (activeSection) {
      case 'patients':
        return <Patients />;
      case 'documents':
        return <Documents />;
      case 'community':
        return <ProfessionalCommunity />;
      default:
        return <Patients />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Painel Profissional</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${
              activeSection === 'patients' ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveSection('patients')}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pacientes</h3>
                <p className="text-sm text-gray-500">Gerencie seus pacientes</p>
              </div>
            </div>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              activeSection === 'documents' ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setActiveSection('documents')}
          >
            <div className="flex items-center space-x-4 p-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
                <p className="text-sm text-gray-500">Relatórios e documentações</p>
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
                <p className="text-sm text-gray-500">Interaja com outros profissionais</p>
              </div>
            </div>
          </Card>
        </div>

        {renderSection()}
      </div>
    </div>
  );
}