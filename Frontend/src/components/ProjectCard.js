import { AlertCircle, Calendar, CheckCircle, Clock, Edit, Eye, Trash2 } from 'lucide-react';
import { formatDateShort } from '../utils/dateUtils';

// Component to display a project card
const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In progress';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="p-6">
        {/* Header with title and status */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
            {project.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} flex items-center gap-1 whitespace-nowrap`}>
            {getStatusIcon(project.status)}
            {getStatusText(project.status)}
          </span>
        </div>
        
        {/* Summary*/}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.summary || project.description}
        </p>
        
        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Start:</span>
            {formatDateShort(project.startDate)}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">End:</span>
            {formatDateShort(project.endDate)}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onView(project)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Editar proyecto"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar proyecto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;