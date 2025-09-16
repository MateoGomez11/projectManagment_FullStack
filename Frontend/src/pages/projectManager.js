import { useState } from 'react';
import Layout from '../components/Layout';
import ProjectDetail from '../components/ProjectDetail';
import ProjectForm from '../components/ProjectForm';
import { useProjects } from '../hooks/useProject';
import ProjectList from './projectList';

// Componente principal que maneja el estado y navegación
const ProjectManager = () => {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    setError
  } = useProjects();

  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener proyecto seleccionado
  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

  // Navegar a crear proyecto
  const handleCreateNew = () => {
    setSelectedProjectId(null);
    setCurrentView('create');
    setError(null);
  };

  // Navegar a ver proyecto
  const handleViewProject = (project) => {
    setSelectedProjectId(project.id);
    setCurrentView('view');
    setError(null);
  };

  // Navegar a editar proyecto
  const handleEditProject = (project) => {
    setSelectedProjectId(project.id);
    setCurrentView('edit');
    setError(null);
  };

  // Eliminar proyecto
  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      // Si estamos viendo o editando el proyecto eliminado, volver a la lista
      if (selectedProjectId === projectId) {
        setCurrentView('list');
        setSelectedProjectId(null);
      }
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  // Volver a la lista
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedProjectId(null);
    setError(null);
  };

  // Manejar envío del formulario
  const handleFormSubmit = async (projectData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (currentView === 'edit') {
        await updateProject(selectedProjectId, projectData);
      } else {
        await createProject(projectData);
      }

      // Volver a la lista después del éxito
      setCurrentView('list');
      setSelectedProjectId(null);
    } catch (error) {
      console.error('Error saving the project:', error);
      // El error se maneja en el hook useProjects
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refrescar datos
  const handleRefresh = () => {
    fetchProjects();
  };

  return (
    <Layout>
      {/* Error global */}
      {error && currentView === 'list' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Renderizar vista actual */}
      {currentView === 'list' && (
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onCreateNew={handleCreateNew}
          onViewProject={handleViewProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onRefresh={handleRefresh}
        />
      )}

      {currentView === 'create' && (
        <ProjectForm
          onSubmit={handleFormSubmit}
          onCancel={handleBackToList}
          loading={isSubmitting}
          isEdit={false}
        />
      )}

      {currentView === 'edit' && (
        <ProjectForm
          project={selectedProject}
          onSubmit={handleFormSubmit}
          onCancel={handleBackToList}
          loading={isSubmitting}
          isEdit={true}
        />
      )}

      {currentView === 'view' && (
        <ProjectDetail
          project={selectedProject}
          onEdit={handleEditProject}
          onBack={handleBackToList}
        />
      )}
    </Layout>
  );
};

export default ProjectManager;