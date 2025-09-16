import { Filter, Grid, List, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import Analytics from '../components/Analytics';
import ProjectCard from '../components/ProjectCard';

// Principal page
const ProjectList = ({
  projects,
  loading,
  error,
  onCreateNew,
  onViewProject,
  onEditProject,
  onDeleteProject,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count projects by status
  const statusCounts = {
    ALL: projects.length,
    PENDING: projects.filter(p => p.status === 'PENDING').length,
    IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS').length,
    COMPLETED: projects.filter(p => p.status === 'COMPLETED').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
          <p className="font-medium mb-2">Error loading projects</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header con título y botón de crear */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Managment projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your projects
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New project
        </button>
      </div>

      {/* Fast stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{statusCounts.ALL}</div>
          <div className="text-sm text-gray-600">total number of projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{statusCounts.IN_PROGRESS}</div>
          <div className="text-sm text-gray-600">In progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{statusCounts.COMPLETED}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Search bar and filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="ALL">All status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* View switch */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 flex items-center gap-2 transition-colors ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 flex items-center gap-2 transition-colors ${viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
          {searchTerm && ` para "${searchTerm}"`}
          {statusFilter !== 'ALL' && ` con estado ${statusFilter}`}
        </p>
      </div>

      {/* List/grid view */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 inline-block">
            <div className="text-gray-400 mb-4">
              <Grid className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'ALL'
                ? 'No projects found'
                : 'No projects yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try change search filters'
                : 'Start creating a project'
              }
            </p>
            {!searchTerm && statusFilter === 'ALL' && (
              <button
                onClick={onCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Create project
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={onViewProject}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}
      <Analytics />
    </div>
  );
};

export default ProjectList;