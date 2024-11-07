import React, { useState } from 'react';
import { RegisterCard } from '../components/RegisterCard';
import { RegisterForm } from '../components/RegisterForm';
import { sendWelcomeEmail } from '../services/email';

type UserType = 'parent' | 'professional' | null;

export function Register() {
  const [selectedType, setSelectedType] = useState<UserType>(null);

  const handleRegistrationSuccess = async (user: any) => {
    try {
      await sendWelcomeEmail({
        to_email: user.email,
        to_name: user.name,
        user_type: user.userType === 'parent' ? 'Pai/Responsável' : 'Profissional'
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Continue with registration even if email fails
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {!selectedType ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Criar Conta</h2>
              <p className="mt-2 text-gray-600">
                Escolha o tipo de conta que melhor se adequa ao seu perfil
              </p>
            </div>
            <div className="space-y-4">
              <RegisterCard
                title="Sou Pai/Mãe/Responsável"
                description="Crie uma conta para acessar recursos e suporte para seu filho"
                icon="parent"
                onClick={() => setSelectedType('parent')}
              />
              <RegisterCard
                title="Sou Profissional"
                description="Crie uma conta para oferecer seus serviços e conectar-se com famílias"
                icon="professional"
                onClick={() => setSelectedType('professional')}
              />
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedType === 'parent' ? 'Cadastro para Pais' : 'Cadastro para Profissionais'}
              </h2>
              <button
                onClick={() => setSelectedType(null)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Voltar
              </button>
            </div>
            <RegisterForm 
              userType={selectedType} 
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          </div>
        )}
      </div>
    </div>
  );
}