import axios from 'axios';

/**
 * Axios instance for Remotive API (Public Jobs API)
 * Base URL: https://remotive.com/api
 * Used for: Fetching remote jobs (Read-Only)
 */
export const remotiveAPI = axios.create({
  baseURL: 'https://remotive.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios instance for JSON Server (Mock Backend)
 * Base URL: http://localhost:3001
 * Used for: CRUD operations on saved job applications
 */
export const localAPI = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== REMOTIVE API CALLS ====================

/**
 * Fetch all remote jobs from Remotive API
 * @param {string} category - Filter by job category (optional)
 * @param {string} search - Search query (optional)
 * @returns {Promise<Array>} Array of job objects
 */
export const fetchRemoteJobs = async (category = '', search = '') => {
  try {
    const response = await remotiveAPI.get('/remote-jobs', {
      params: {
        category: category || undefined,
        search: search || undefined,
      },
    });
    return response.data.jobs || [];
  } catch (error) {
    console.error('Error fetching remote jobs:', error);
    throw new Error('Failed to fetch jobs. Please try again later.');
  }
};

/**
 * Fetch a single job by ID
 * Note: Remotive doesn't have a direct endpoint for single job,
 * so we fetch all and filter by ID
 * @param {number} jobId - The job ID
 * @returns {Promise<Object>} Job object
 */
export const fetchJobById = async (jobId) => {
  try {
    const response = await remotiveAPI.get('/remote-jobs');
    const job = response.data.jobs.find((job) => job.id === parseInt(jobId));
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return job;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw new Error('Failed to fetch job details.');
  }
};

// ==================== LOCAL API CALLS (JSON Server) ====================

/**
 * Fetch all saved applications from local database
 * @returns {Promise<Array>} Array of saved applications
 */
export const fetchSavedApplications = async () => {
  try {
    const response = await localAPI.get('/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved applications:', error);
    throw new Error('Failed to fetch your applications.');
  }
};

/**
 * Save a new job application to local database
 * @param {Object} jobData - The job data to save
 * @returns {Promise<Object>} The created application
 */
export const saveJobApplication = async (jobData) => {
  try {
    const response = await localAPI.post('/applications', {
      ...jobData,
      status: 'saved',
      savedAt: new Date().toISOString(),
      notes: '',
    });
    return response.data;
  } catch (error) {
    console.error('Error saving job application:', error);
    throw new Error('Failed to save job application.');
  }
};

/**
 * Update an existing application (status, notes, etc.)
 * @param {string} id - Application ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated application
 */
export const updateApplication = async (id, updates) => {
  try {
    const response = await localAPI.patch(`/applications/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw new Error('Failed to update application.');
  }
};

/**
 * Delete an application from local database
 * @param {string} id - Application ID
 * @returns {Promise<void>}
 */
export const deleteApplication = async (id) => {
  try {
    await localAPI.delete(`/applications/${id}`);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application.');
  }
};

/**
 * Check if a job is already saved
 * @param {number} jobId - The Remotive job ID
 * @returns {Promise<boolean>} True if already saved
 */
export const isJobSaved = async (jobId) => {
  try {
    const response = await localAPI.get('/applications', {
      params: { jobId },
    });
    return response.data.length > 0;
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
};
