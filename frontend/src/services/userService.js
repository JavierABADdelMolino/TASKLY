// Servicio centralizado para operaciones de usuario (profile)
const API_BASE_URL = process.env.REACT_APP_API_URL;

async function getAuthHeaders(isJson = true) {
  const token = sessionStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  if (isJson) headers['Content-Type'] = 'application/json';
  return headers;
}

// Obtener perfil del usuario autenticado
export async function getUserProfile() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/users/me`, { headers, method: 'GET' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'No se pudo obtener el perfil');
  return data;
}

// Actualizar perfil (name, email, avatar opcional)
// profileData puede ser un objeto con campos { firstName, lastName, email, avatar (File) }
export async function updateUserProfile(profileData) {
  const token = sessionStorage.getItem('token');
  const formData = new FormData();
  if (profileData.firstName != null) formData.append('firstName', profileData.firstName);
  if (profileData.lastName != null) formData.append('lastName', profileData.lastName);
  if (profileData.email != null) formData.append('email', profileData.email);
  if (profileData.avatar != null) formData.append('avatar', profileData.avatar);

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar perfil');
  return data;
}

// Cambiar contraseña del usuario autenticado
export async function changePassword(currentPassword, newPassword) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al cambiar la contraseña');
  return data;
}

// Eliminar cuenta del usuario autenticado
export async function deleteUserAccount() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'DELETE',
    headers,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar la cuenta');
  return data;
}
