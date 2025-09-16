import { AlertCircle, ArrowLeft, Calendar, CheckCircle, Clock, Edit, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '../utils/dateUtils';

// Component to display full details of a project
const ProjectDetail = ({ project, onEdit, onBack }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [geminiSummary, setGeminiSummary] = useState(project.summary || '');
  const [summaryError, setSummaryError] = useState('');
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-6 h-6 text-blue-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to generate Gemini summary
  const handleGenerateSummary = async () => {
    if (!project.description?.trim()) {
      setSummaryError('No description available to summarize');
      return;
    }

    setIsGeneratingSummary(true);
    setSummaryError('');

    try {
      const response = await fetch(`http://localhost:5001/api/projects/${project.id}/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setGeminiSummary(data.summary || data);
      
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryError('Error generating summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Calculate project duration
  const calculateDuration = () => {
    if (!project.startDate || !project.endDate) return 'Not defined';
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.round(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }
  };

  //Calculate progress (simplified date-based)
  const calculateProgress = () => {
    if (!project.startDate || !project.endDate) return 0;
    
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end || project.status === 'COMPLETED') return 100;
    
    const totalTime = end - start;
    const elapsedTime = now - start;
    return Math.round((elapsedTime / totalTime) * 100);
  };

  const progress = calculateProgress();

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Project not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Project details</h1>
      </div>

      {/* Contenido principal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header del proyecto */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {project.name}
              </h2>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(project.status)} flex items-center gap-2`}>
                  {getStatusIcon(project.status)}
                  {getStatusText(project.status)}
                </span>
                <span className="text-sm text-gray-500">
                  ID: #{project.id}
                </span>
              </div>
            </div>
            <button
              onClick={() => onEdit(project)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit project
            </button>
          </div>
        </div>

        {/* General information */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Dates*/}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Schedule</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Start:</span>
                  <div className="text-gray-900">{formatDate(project.startDate)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">End:</span>
                  <div className="text-gray-900">{formatDate(project.endDate)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Duration:</span>
                  <div className="text-gray-900">{calculateDuration()}</div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="font-semibold text-gray-900">Progress</h3>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Complete</span>
                  <span className="text-sm font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/*Aditional stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Characters:</span>
                  <div className="text-gray-900">{project.description?.length || 0}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last update:</span>
                  <div className="text-gray-900">
                    {project.summaryAt ? formatDate(project.summaryAt) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Project description</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>

          {/* GEMINI SUMMARY SECTION */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Gemini description</h3>
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || !project.description?.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Sparkles className={`w-4 h-4 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                {isGeneratingSummary ? 'Generating...' : 'Gemini Summarize'}
              </button>
            </div>
            
            {/* Error message */}
            {summaryError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {summaryError}
              </div>
            )}
            
            {/* Summary content */}
            {geminiSummary && geminiSummary !== project.description ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 leading-relaxed">
                  {geminiSummary}
                </p>
              </div>
            ) : !isGeneratingSummary && !summaryError && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-500 italic">
                  Click "Gemini Summarize" to generate an AI summary of your project description.
                </p>
              </div>
            )}
            
            {/* Loading state */}
            {isGeneratingSummary && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <p className="text-purple-700">Generating summary with Gemini AI...</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;