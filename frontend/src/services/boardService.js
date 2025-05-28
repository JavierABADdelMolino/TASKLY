// Servicio centralizado de pizarras (boards)
const API_BASE_URL = process.env.REACT_APP_API_URL;

async function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Obtener todas las pizarras del usuario
export async function getBoards() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/boards`, { headers });
  return res.json();
}

// Obtener una pizarra por ID
export async function getBoardById(boardId) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, { headers });
  return res.json();
}

// Crear nueva pizarra
export async function createBoard({ title, description }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/boards`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, description })
    }
  );
  return res.json();
}

// Actualizar pizarra
export async function updateBoard(boardId, { title, description }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/boards/${boardId}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ title, description })
    }
  );
  return res.json();
}

// Eliminar pizarra
export async function deleteBoard(boardId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/boards/${boardId}`,
    { method: 'DELETE', headers }
  );
  return res.json();
}

// Marcar o desmarcar favorita exclusiva
export async function toggleFavoriteBoard(boardId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/boards/${boardId}/favorite`,
    {
      method: 'PUT',
      headers
    }
  );
  return res.json();
}
