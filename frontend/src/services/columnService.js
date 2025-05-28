// Servicio centralizado de columnas (columns)
const API_BASE_URL = process.env.REACT_APP_API_URL;

async function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Obtener columnas de una pizarra
export async function getColumnsByBoard(boardId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/columns/board/${boardId}`,
    { headers }
  );
  return res.json();
}

// Crear nueva columna en pizarra
export async function createColumn(boardId, { title }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/columns/board/${boardId}`,
    { method: 'POST', headers, body: JSON.stringify({ title }) }
  );
  return res.json();
}

// Actualizar columna (título, orden)
export async function updateColumn(columnId, data) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/columns/${columnId}`,
    { method: 'PUT', headers, body: JSON.stringify(data) }
  );
  return res.json();
}

// Eliminar columna
export async function deleteColumn(columnId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/columns/${columnId}`,
    { method: 'DELETE', headers }
  );
  return res.json();
}
