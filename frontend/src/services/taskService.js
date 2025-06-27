// Servicio centralizado de tareas y sugerencias IA
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Función centralizada para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.warn('No hay token de autenticación disponible');
  }
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
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

// Crear tarea en columna
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

// Obtener tareas de una columna con filtro opcional
export async function getTasksByColumn(columnId, filter = 'all') {
  try {
    const headers = await getAuthHeaders();
    let endpoint;
    
    if (filter === 'all') {
      endpoint = `${API_BASE_URL}/tasks/columns/${columnId}`;
    } else {
      endpoint = `${API_BASE_URL}/tasks/columns/${columnId}/filtered?filter=${filter}`;
    }
    
    const res = await fetch(endpoint, { headers });
    
    if (!res.ok) {
      const errorData = await res.json();
      return errorData;
    }
    
    return await res.json();
  } catch (err) {
    return { message: 'Error de conexión al obtener tareas' };
  }
}

// Actualizar estado de completado de una tarea
export async function toggleTaskCompletion(taskId, completed) {
  try {
    const token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const url = `${API_BASE_URL}/tasks/${taskId}/completion`;
    
    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ completed: !!completed }) // Asegura que sea un booleano
    });
    
    // Obtener la respuesta como texto primero para depurar
    const responseText = await res.text();
    
    // Intentar parsear como JSON si hay contenido
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      throw new Error('Respuesta inválida del servidor');
    }
    
    if (!res.ok) {
      throw new Error(data.message || 'Error al cambiar estado de tarea');
    }
    
    return data;
  } catch (err) {
    // Retornamos un objeto con información del error en lugar de lanzar la excepción
    return { error: true, message: err.message || 'Error al actualizar tarea' };
  }
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