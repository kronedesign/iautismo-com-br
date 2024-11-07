import React, { useState } from 'react';
import { Camera, Lock, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../components/Card';
import { initDB } from '../database/setup';

interface ProfileProps {
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  onNavigate?: (page: string) => void;
}

export function Profile({ user, onUpdateUser, onNavigate }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'password' | 'reset'>('photo');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoSaved, setPhotoSaved] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = async () => {
    if (!photoPreview) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const db = await initDB();
      const transaction = db.transaction(['users'], 'readwrite');
      const userStore = transaction.objectStore('users');
      
      const updatedUser = { ...user, photoUrl: photoPreview };
      await userStore.put(updatedUser);
      
      onUpdateUser(updatedUser);
      setSuccess('Foto atualizada com sucesso!');
      setPhotoSaved(true);
    } catch (err) {
      setError('Erro ao atualizar foto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      if (newPassword.length < 8) {
        throw new Error('A nova senha deve ter pelo menos 8 caracteres');
      }
      
      const db = await initDB();
      const transaction = db.transaction(['users'], 'readwrite');
      const userStore = transaction.objectStore('users');
      
      const userRequest = userStore.get(user.id);
      
      const result = await new Promise((resolve, reject) => {
        userRequest.onsuccess = () => {
          const userData = userRequest.result;
          if (userData.password !== currentPassword) {
            reject(new Error('Senha atual incorreta'));
            return;
          }
          
          const updatedUser = { ...userData, password: newPassword };
          const updateRequest = userStore.put(updatedUser);
          
          updateRequest.onsuccess = () => resolve(updatedUser);
          updateRequest.onerror = () => reject(updateRequest.error);
        };
        userRequest.onerror = () => reject(userRequest.error);
      });
      
      onUpdateUser(result);
      setSuccess('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate sending reset email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Email de redefinição de senha enviado! Verifique sua caixa de entrada.');
    } catch (err) {
      setError('Erro ao enviar email de redefinição');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (user?.userType === 'admin') {
      onNavigate?.('admin');
    } else {
      onNavigate?.('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
          <button
            onClick={handleBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('photo')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'photo'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Camera className="w-5 h-5 inline-block mr-2" />
                Foto
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Lock className="w-5 h-5 inline-block mr-2" />
                Alterar Senha
              </button>
              <button
                onClick={() => setActiveTab('reset')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'reset'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className="w-5 h-5 inline-block mr-2" />
                Recuperar Senha
              </button>
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                {success}
              </div>
            )}

            {activeTab === 'photo' && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                </div>
                {photoPreview && !photoSaved && (
                  <div className="flex justify-center">
                    <button
                      onClick={handlePhotoSave}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Salvando...' : 'Salvar Foto'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary"
                >
                  {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </form>
            )}

            {activeTab === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Email de Recuperação'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}