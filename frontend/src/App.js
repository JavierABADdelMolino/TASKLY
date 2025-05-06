import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('⏳ Cargando...');

  useEffect(() => {
    fetch('http://localhost:5000/api/ping')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('❌ Error al conectar con el backend'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edita <code>src/App.js</code> y guarda para recargar.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aprende React
        </a>

        {/* Resultado de la llamada al backend */}
        <p style={{ marginTop: '2rem' }}>
          <strong>Estado del backend:</strong> {message}
        </p>
      </header>
    </div>
  );
}

export default App;
