import React from 'react';
import { 
  Users, 
  Shield, 
  CreditCard, 
  Award, 
  Home,
  Settings,
  LogOut,
  History,
  Bot
} from 'lucide-react';
import { AdminNavLink } from '../../components/AdminNavLink';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Layout({ children, currentPage = 'dashboard', onNavigate }: LayoutProps) {
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: 'dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Usuários', path: 'users' },
    { icon: <Bot className="w-5 h-5" />, label: 'Agentes IA', path: 'agents' },
    { icon: <History className="w-5 h-5" />, label: 'Histórico', path: 'history' },
    { icon: <Shield className="w-5 h-5" />, label: 'Níveis de Acesso', path: 'access-levels' },
    { icon: <Award className="w-5 h-5" />, label: 'Especialistas', path: 'specialists' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Pagamentos', path: 'payments' },
    { icon: <Settings className="w-5 h-5" />, label: 'Configurações', path: 'settings' },
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-bold text-indigo-600">IAutismo Admin</span>
              </div>
              <div className="mt-8 flex-grow flex flex-col">
                <nav className="flex-1 px-2 space-y-1">
                  {menuItems.map((item) => (
                    <AdminNavLink
                      key={item.path}
                      icon={item.icon}
                      label={item.label}
                      path={item.path}
                      isActive={currentPage === item.path}
                      onClick={() => onNavigate?.(item.path)}
                    />
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 w-full group">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Admin User
                      </p>
                      <button
                        onClick={handleLogout}
                        className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}