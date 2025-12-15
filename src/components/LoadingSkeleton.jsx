/**
 * Loading Skeleton Component:  Placeholder during data fetch
 */
const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md: grid-cols-2 lg: grid-cols-3 gap-6">
      {Array. from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
