// Servicio centralizado para autenticación (auth)
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Iniciar sesión: retorna { token }
export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
  return data;
}

// Obtener usuario autenticado usando token en sessionStorage
export async function getCurrentUser() {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'No se pudo obtener el usuario');
  return data;
}

// Registrar nuevo usuario con posible avatar
export async function register(formData) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al registrar usuario');
  return data; // { token, user }
}

// Enviar email de recuperación de contraseña
export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al enviar email de recuperación');
  return data;
}

// Restablecer contraseña con token
export async function resetPassword(token, password) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al restablecer contraseña');
  return data;
}
