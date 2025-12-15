import { MapPin, Building, Calendar } from 'lucide-react';

/**
 * JobCard component
 * Displays job information in a card format
 * @param {Object} props - Component props
 * @param {Object} props.job - Job data object
 * @param {Function} props.onSave - Callback when save button is clicked
 * @param {Function} props.onClick - Callback when card is clicked
 * @param {boolean} props.isSaved - Whether job is already saved
 */
const JobCard = ({ job, onSave, onClick, isSaved = false }) => {
  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) {
      onSave(job);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Building size={16} />
            <span>{job.company_name}</span>
          </div>
        </div>
        {onSave && (
          <button
            onClick={handleSaveClick}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSaved
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{job.candidate_required_location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>
            Posted: {new Date(job.publication_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {job.job_type && (
        <div className="mt-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {job.job_type}
          </span>
        </div>
      )}
    </div>
  );
};

export default JobCard;
