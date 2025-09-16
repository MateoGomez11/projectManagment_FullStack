import { Briefcase } from 'lucide-react';

// Main Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Project managment
              </h1>
              <p className="text-sm text-gray-600">
                Administration and monitoring system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            © 2025 Project managment. Mateo Gomez Patiño
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;