import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente separador adaptativo que se ajusta al tema y al contenedor padre
 * @param {Object} props
 * @param {string} props.text - Texto a mostrar en el separador (por defecto: "O")
 */
const Separator = ({ text = 'O' }) => {
  const { theme } = useTheme();
  
  return (
    <div className="separator my-3">
      <span 
        style={{ 
          backgroundColor: theme === 'dark' ? 'var(--bs-dark)' : 'var(--bs-white)',
          padding: '0 15px',
          color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
        }}
      >
        {text}
      </span>
    </div>
  );
};

export default Separator;
