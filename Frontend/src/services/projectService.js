// Servicio para manejar las llamadas a la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Función para manejar errores de la API
const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    throw new Error(error.response.data.message || 'Error del servidor');
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor');
  } else {
    throw new Error('Error inesperado');
  }
};

// Obtener todos los proyectos
export const getProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en getProjects:', error);
    handleApiError(error);
  }
};

// Crear nuevo proyecto
export const createProject = async (projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en createProject:', error);
    handleApiError(error);
  }
};

// Actualizar proyecto
export const updateProject = async (id, projectData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error en updateProject:', error);
    handleApiError(error);
  }
};

// Eliminar proyecto
export const deleteProject = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Algunos backends devuelven el proyecto eliminado, otros solo un status
    try {
      const data = await response.json();
      return data;
    } catch {
      // Si no hay JSON en la respuesta, retornar éxito
      return { success: true };
    }

  } catch (error) {
    console.error('Error en deleteProject:', error);
    handleApiError(error);
  }
};