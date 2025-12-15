import { Link, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard } from 'lucide-react';

/**
 * Navigation Bar Component
 */
const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ?  'bg-blue-700' : '';
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <Briefcase size={28} />
            DevJob Tracker
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors ${isActive(
                '/'
              )}`}
            >
              Jobs
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 ${isActive(
                '/dashboard'
              )}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
