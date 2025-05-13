import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Actualiza los días válidos al cambiar mes/año
  useEffect(() => {
    if (birthMonth && birthYear) {
      const days = new Date(birthYear, birthMonth, 0).getDate();
      setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
      if (birthDay > days) setBirthDay('');
    }
  }, [birthDay, birthMonth, birthYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!birthDay || !birthMonth || !birthYear) {
      setError('Debes seleccionar una fecha de nacimiento válida');
      return;
    }

    const birthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, birthDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al registrarse');
        return;
      }

      sessionStorage.setItem('token', data.token);

      const userRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        setError(userData.message || 'No se pudo obtener el usuario');
        return;
      }

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrarse</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <label style={{ marginTop: '1rem' }}>Fecha de nacimiento</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} required>
          <option value="">Día</option>
          {daysInMonth.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} required>
          <option value="">Mes</option>
          {monthNames.map((name, idx) => (
            <option key={idx + 1} value={idx + 1}>{name}</option>
          ))}
        </select>

        <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} required>
          <option value="">Año</option>
          {Array.from({ length: 100 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default RegisterForm;
