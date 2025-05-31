// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import RouteChangeLoader from './components/ui/RouteChangeLoader';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/theme.scss';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoaderProvider } from './context/LoaderContext';
import Loader from './components/ui/Loader';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoaderProvider>
      <AuthProvider>
        <BrowserRouter>
          <ThemeProvider>
            <Loader />
            <RouteChangeLoader /> {/* 👈 Loader al navegar entre páginas */}
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </LoaderProvider>
  </React.StrictMode>
);
