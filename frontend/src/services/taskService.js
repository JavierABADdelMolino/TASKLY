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
export async function suggestImportanceForNewTask(columnId, title, description, dueDateTime) {
  try {
    const headers = await getAuthHeaders();
    const payload = { title, description };
    if (dueDateTime) payload.dueDateTime = dueDateTime;
    const res = await fetch(
      `${API_BASE_URL}/tasks/columns/${columnId}/suggest-importance`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      }
    );
    const data = await res.json();
    return res.ok && data.suggestedImportance ? data.suggestedImportance : null;
  } catch {
    return null;
  }
}

// Sugerencia IA para tarea existente
export async function suggestImportanceForExistingTask(taskId, title, description, dueDateTime) {
  try {
    const headers = await getAuthHeaders();
    const payload = { title, description };
    if (dueDateTime) payload.dueDateTime = dueDateTime;
    const res = await fetch(
      `${API_BASE_URL}/tasks/${taskId}/suggest-importance`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      }
    );
    const data = await res.json();
    return res.ok && data.suggestedImportance ? data.suggestedImportance : null;
  } catch {
    return null;
  }
}

// Crear tarea
export async function createTask(columnId, { title, description, importance, dueDateTime }) {
  const headers = await getAuthHeaders();
  const payload = { title, description, importance };
  if (dueDateTime) payload.dueDateTime = dueDateTime;
  const res = await fetch(
    `${API_BASE_URL}/tasks/columns/${columnId}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }
  );
  return res.json();
}

// Actualizar tarea (permite campos dinámicos como column, title, description, importance)
export async function updateTask(taskId, data) {
  const headers = await getAuthHeaders();
  const payload = { ...data };
  if (!payload.dueDateTime) delete payload.dueDateTime;
  const res = await fetch(
    `${API_BASE_URL}/tasks/${taskId}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
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

// Obtener tareas por columna
export async function getTasksByColumn(columnId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/tasks/columns/${columnId}`,
    { headers }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tareas');
  return data;
}

// Marcar tarea como completada
export async function markTaskAsCompleted(taskId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/tasks/${taskId}/complete`,
    { method: 'POST', headers }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al marcar como completada');
  return data;
}

// Marcar tarea como incompleta
export async function markTaskAsIncomplete(taskId) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/tasks/${taskId}/incomplete`,
    { method: 'POST', headers }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al marcar como incompleta');
  return data;
}