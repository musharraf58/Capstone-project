import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';

/**
 * Job Card Component:  Displays job summary in grid
 */
const JobCard = ({ job }) => {
  return (
    <Link to={`/job/${job.id}`} className="card block hover:scale-105 transition-transform">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{job.title}</h3>
          <p className="text-gray-600 font-medium">{job.company_name}</p>
        </div>
        {job.company_logo && (
          <img
            src={job.company_logo}
            alt={job. company_name}
            className="w-12 h-12 object-contain rounded ml-3"
          />
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{job.candidate_required_location || 'Worldwide'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          <span>{job.job_type || 'Full-time'}</span>
        </div>
      </div>

      {job.category && (
        <div className="mt-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {job.category}
          </span>
        </div>
      )}

      <div className="mt-4 text-primary font-medium text-sm">
        View Details →
      </div>
    </Link>
  );
};

export default JobCard;
