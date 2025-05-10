import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📩 Enviando login:', formData);
    // Aquí luego se hará la petición al backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        required
        value={formData.password}
        onChange={handleChange}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default LoginForm;
