/**
 * LoadingSkeleton component
 * Displays animated skeleton loader while content is loading
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton items to display (default: 3)
 * @param {string} props.type - Skeleton type: 'card' or 'list' (default: 'card')
 */
const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons.map((index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            
            {/* Company skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            
            {/* Details skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            {/* Tag skeleton */}
            <div className="mt-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {skeletons.map((index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
