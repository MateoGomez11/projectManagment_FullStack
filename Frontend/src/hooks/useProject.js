import { useEffect, useState } from 'react';
import * as projectService from '../services/projectService';

// Custom hook para manejar el estado de los proyectos
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar proyectos
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const createProject = async (projectData) => {
    try {
      setError(null);
      const newProject = await projectService.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    try {
      setError(null);
      const updatedProject = await projectService.updateProject(id, projectData);
      setProjects(prev => 
        prev.map(project => 
          project.id === id ? { ...project, ...updatedProject } : project
        )
      );
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      setError(null);
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get project by Id
  const getProjectById = (id) => {
    return projects.find(project => project.id === parseInt(id));
  };

  // upload projects by hook
  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    setError
  };
};