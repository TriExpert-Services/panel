import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Home, FileText, Moon, Sun, LogOut, User, Building, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell, NotificationCenter } from './NotificationCenter';
import { LanguageSelector } from './LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);
  const isOrderDetail = location.pathname.startsWith('/orden/');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('app.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('app.version', { version: '1.0.0' })}</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <NotificationBell onClick={() => setShowNotifications(true)} />
              <LanguageSelector />
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{t('navigation.dashboard')}</span>
              </Link>
              <Link
                to="/perfil"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/perfil'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('navigation.profile')}</span>
              </Link>
              <Link
                to="/empresa"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/empresa'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{t('navigation.company')}</span>
              </Link>
              <Link
                to="/plantillas"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/plantillas'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t('navigation.templates')}</span>
              </Link>
              {isOrderDetail && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4" />
                  <span>Detalle de Orden</span>
                </div>
              )}
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="hidden md:block">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {user?.email}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Administrador
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-sm font-medium">{t('navigation.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}