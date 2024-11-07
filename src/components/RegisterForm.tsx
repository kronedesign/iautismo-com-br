import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { createUser } from '../database/users';
import { UserSchema, ProfessionalSchema } from '../database/setup';

interface RegisterFormProps {
  userType: 'parent' | 'professional';
  onRegistrationSuccess?: (user: any) => void;
}

export function RegisterForm({ userType, onRegistrationSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ...(userType === 'professional' && {
      profession: '',
      specialization: '',
      license: '',
    }),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (formData.password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }

      const userData = UserSchema.parse({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType,
      });

      let professionalData;
      if (userType === 'professional') {
        professionalData = ProfessionalSchema.parse({
          profession: formData.profession,
          specialization: formData.specialization,
          licenseNumber: formData.license,
        });
      }

      const userId = await createUser(userData, professionalData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        ...(userType === 'professional' && {
          profession: '',
          specialization: '',
          license: '',
        }),
      });

      if (onRegistrationSuccess) {
        onRegistrationSuccess({ ...userData, id: userId });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao processar cadastro');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-600">Cadastro realizado com sucesso!</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha <span className="text-gray-500 font-normal">(mínimo 8 caracteres)</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar Senha
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      {userType === 'professional' && (
        <>
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
              Profissão
            </label>
            <select
              name="profession"
              id="profession"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.profession}
              onChange={handleChange}
            >
              <option value="">Selecione sua profissão</option>
              <option value="to">Terapeuta Ocupacional</option>
              <option value="psychologist">Psicólogo(a)</option>
              <option value="speech">Fonoaudiólogo(a)</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
              Especialização em Autismo
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="license" className="block text-sm font-medium text-gray-700">
              Número de Registro Profissional
            </label>
            <input
              type="text"
              name="license"
              id="license"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.license}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}