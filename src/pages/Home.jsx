import { useState, useEffect } from 'react';
import { fetchRemoteJobs } from '../services/api';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { AlertCircle } from 'lucide-react';

/**
 * Home Page:  Main job board displaying remote jobs from Remotive API
 * Features:  Search, Category Filter, Responsive Grid Layout
 */
const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /**
   * Fetch jobs on component mount
   */
  useEffect(() => {
    loadJobs();
  }, []);

  /**
   * Apply filters whenever search/category changes
   */
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, jobs]);

  /**
   * Fetch remote jobs from Remotive API
   */
  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRemoteJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter jobs based on search query and category
   */
  const applyFilters = () => {
    let filtered = [...jobs];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (job) => job.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query (title, company, description)
    if (searchQuery. trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title?. toLowerCase().includes(query) ||
          job.company_name?.toLowerCase().includes(query) ||
          job.description?.toLowerCase().includes(query)
      );
    }

    setFilteredJobs(filtered);
  };

  /**
   * Get unique categories from jobs
   */
  const getCategories = () => {
    const categories = jobs.map((job) => job.category).filter(Boolean);
    return [...new Set(categories)];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Remote Jobs</h1>
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Jobs</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Find Your Next Remote Job</h1>
        <p className="text-gray-600">
          Browse {jobs.length} remote opportunities worldwide
        </p>
      </div>

      {/* Filters */}
      <JobFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={getCategories()}
      />

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredJobs.length}</span> jobs
        </p>
      </div>

      {/* Job Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No jobs found.  Try adjusting your filters. 
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs. map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
