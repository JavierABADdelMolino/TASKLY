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
    <div className="text-center my-2">
      <div className="position-relative d-flex align-items-center justify-content-center py-2">
        <div 
          className="position-absolute w-100" 
          style={{ 
            height: '1px',
            background: `linear-gradient(to right, transparent 10%, ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} 50%, transparent 90%)`
          }}
        />
        <div className="separator-text-wrapper">
          <span 
            className={`px-3 position-relative separator-text ${theme === 'dark' ? 'dark' : 'light'}`}
            style={{ 
              fontSize: '0.9rem',
              color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontWeight: '500'
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Separator;
