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
  if (!res.ok) {
    const error = new Error(data.message || 'Error al registrar usuario');
    // adjunta errores de validación de Mongoose si existen
    if (data.errors) {
      error.validation = data.errors;
    }
    throw error;
  }
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
  if (!res.ok) {
    const error = new Error(data.message || 'Error al enviar email de recuperación');
    if (data.isGoogleAccount) {
      error.isGoogleAccount = true;
    }
    throw error;
  }
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

// Iniciar sesión con Google (o iniciar proceso de registro)
export async function googleLogin(tokenId) {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al autenticar con Google');
  return data;
}

// Completar registro con Google (añadiendo campos adicionales)
export async function completeGoogleRegister(formData) {
  const res = await fetch(`${API_BASE_URL}/auth/google-register-complete`, {
    method: 'POST',
    // No establecemos 'Content-Type' para que lo haga automáticamente con el boundary
    // cuando se envía FormData con archivos
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Error al completar el registro con Google');
    if (data.errors) {
      error.validation = data.errors;
    }
    throw error;
  }
  return data; // { token, user }
}

// Enlazar cuenta de Google con cuenta existente
export async function linkGoogleAccount(email, googleId, tokenId) {
  const res = await fetch(`${API_BASE_URL}/auth/link-google-account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, googleId, tokenId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al enlazar cuenta de Google');
  return data;
}
