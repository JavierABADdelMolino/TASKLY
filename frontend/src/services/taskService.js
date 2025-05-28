// Servicio centralizado de tareas y sugerencias IA
const API_BASE_URL = process.env.REACT_APP_API_URL;

async function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Sugerencia IA para nueva tarea en columna
export async function suggestImportanceForNewTask(columnId, title, description) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_BASE_URL}/tasks/columns/${columnId}/suggest-importance`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, description })
      }
    );
    const data = await res.json();
    return res.ok && data.suggestedImportance ? data.suggestedImportance : null;
  } catch {
    return null;
  }
}

// Sugerencia IA para tarea existente
export async function suggestImportanceForExistingTask(taskId, title, description) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_BASE_URL}/tasks/${taskId}/suggest-importance`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ title, description })
      }
    );
    const data = await res.json();
    return res.ok && data.suggestedImportance ? data.suggestedImportance : null;
  } catch {
    return null;
  }
}

// Crear tarea
export async function createTask(columnId, { title, description, importance }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/tasks/columns/${columnId}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, description, importance })
    }
  );
  return res.json();
}

// Actualizar tarea
export async function updateTask(taskId, { title, description, importance }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/tasks/${taskId}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ title, description, importance })
    }
  );
  return res.json();
}

// Eliminar tarea
export async function deleteTask(taskId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/tasks/${taskId}`,
    { method: 'DELETE', headers }
  );
  return res.json();
}