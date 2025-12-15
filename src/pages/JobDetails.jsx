import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById } from '../services/api';
import { useJobs } from '../context/JobContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { ArrowLeft, ExternalLink, MapPin, DollarSign, Briefcase, CheckCircle } from 'lucide-react';

/**
 * Job Details Page: View full job description and save to dashboard
 */
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addApplication, isJobTracked } = useJobs();
  const { toast, showToast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  /**
   * Fetch job details from Remotive API
   */
  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJobById(id);
      setJob(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save job to dashboard via POST request
   */
  const handleTrackJob = async () => {
    try {
      setSaving(true);
      
      await addApplication({
        jobId: job.id,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || 'Remote',
        salary: job.salary || 'Not specified',
        category: job.category,
        url: job.url,
      });

      showToast('Job saved to dashboard!', 'success');
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="btn-secondary mb-6">
          <ArrowLeft size={20} className="inline mr-2" />
          Go Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error || 'Job not found'}</p>
        </div>
      </div>
    );
  }

  const isTracked = isJobTracked(job.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6">
        <ArrowLeft size={20} className="inline mr-2" />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-xl text-gray-700">{job.company_name}</p>
          </div>
          <img
            src={job.company_logo || 'https://via.placeholder.com/80'}
            alt={job.company_name}
            className="w-20 h-20 object-contain rounded"
          />
        </div>

        {/* Job Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} />
            <span>{job.candidate_required_location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign size={20} />
            <span>{job.salary || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase size={20} />
            <span>{job.job_type || 'Full-time'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            Apply on Company Site
            <ExternalLink size={18} />
          </a>

          {isTracked ?  (
            <button disabled className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed">
              <CheckCircle size={18} />
              Already Tracked
            </button>
          ) : (
            <button
              onClick={handleTrackJob}
              disabled={saving}
              className="btn-secondary"
            >
              {saving ?  'Saving...' : 'Track This Job'}
            </button>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Job Description</h2>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </div>

      {/* Tags */}
      {job.tags && job.tags. length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold mb-4">Skills & Tags</h2>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
