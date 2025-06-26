// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
// Páginas corporativas
import AboutPage from './pages/corporate/AboutPage';
import ContactPage from './pages/corporate/ContactPage';
import FAQPage from './pages/corporate/FAQPage';
import PrivacyPage from './pages/corporate/PrivacyPage';
import TermsPage from './pages/corporate/TermsPage';
import CookiesPage from './pages/corporate/CookiesPage';

import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Rutas principales */}
      <Route path="/" element={<Home />} />
      <Route path="/reset-password/:token" element={<Home />} />
      
      {/* Rutas privadas (requieren autenticación) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      
      {/* Páginas corporativas */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      
      {/* Ruta wildcard: redirige al home para todos los paths no reconocidos */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
