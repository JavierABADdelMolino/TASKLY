import { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📩 Enviando registro:', formData);
    // Aquí luego se hará la petición al backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        required
        value={formData.username}
        onChange={handleChange}
      />
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
      <button type="submit">Crear cuenta</button>
    </form>
  );
};

export default RegisterForm;
