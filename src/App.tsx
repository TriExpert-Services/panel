import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { OrderDetail } from './pages/OrderDetail';
import { ProfilePage } from './pages/ProfilePage';
import { CompanyPage } from './pages/CompanyPage';
import { EmailTemplatesPage } from './pages/EmailTemplatesPage';
import { LoginPage } from './pages/LoginPage';
import { ClientVerification } from './pages/ClientVerification';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verificar/:token" element={<ClientVerification />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orden/:id" element={<OrderDetail />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/empresa" element={<CompanyPage />} />
                <Route path="/plantillas" element={<EmailTemplatesPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;