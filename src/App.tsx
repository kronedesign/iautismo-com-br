import React, { useState } from 'react';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Faq } from './pages/Faq';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { UserDashboard } from './pages/UserDashboard';
import { ProfessionalDashboard } from './pages/ProfessionalDashboard';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setCurrentPage(
      user.userType === 'admin' 
        ? 'admin' 
        : user.userType === 'professional'
          ? 'professional'
          : 'dashboard'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleUpdateUser = (updatedUser: any) => {
    setCurrentUser(updatedUser);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} currentUser={currentUser} />;
      case 'register':
        return <Register />;
      case 'faq':
        return <Faq />;
      case 'profile':
        return currentUser ? (
          <Profile user={currentUser} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />
        ) : (
          <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        );
      case 'admin':
        return currentUser?.userType === 'admin' ? (
          <AdminDashboard />
        ) : (
          <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        );
      case 'professional':
        return currentUser?.userType === 'professional' ? (
          <ProfessionalDashboard onNavigate={handleNavigate} />
        ) : (
          <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        );
      case 'dashboard':
        return currentUser ? (
          <UserDashboard onNavigate={handleNavigate} currentUser={currentUser} />
        ) : (
          <Login onLogin={handleLogin} onNavigate={handleNavigate} />
        );
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} currentUser={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigate('home')}
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-800"
              >
                IAutismo
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="btn btn-secondary"
                  >
                    Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate('register')}
                    className="btn btn-secondary"
                  >
                    Cadastro
                  </button>
                  <button
                    onClick={() => handleNavigate('faq')}
                    className="btn btn-primary"
                  >
                    FAQ
                  </button>
                  <button
                    onClick={() => handleNavigate('login')}
                    className="btn btn-secondary"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {renderPage()}
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2024 IAutismo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}