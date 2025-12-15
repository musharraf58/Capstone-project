import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

/**
 * 404 Not Found Page
 */
const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <Home size={20} />
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
