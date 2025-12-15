import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSavedApplications, saveJobApplication, updateApplication, deleteApplication } from '../services/api';

/**
 * JobContext: Centralized state management for tracked job applications
 * Provides CRUD operations and state to all components
 */
const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load all saved applications on initial mount
   */
  useEffect(() => {
    loadApplications();
  }, []);

  /**
   * Fetch applications from JSON Server
   */
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSavedApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new job to tracked applications
   * Prevents duplicate saves
   * @param {Object} jobData - Job information from Remotive API
   * @returns {Promise<Object>} The created application or null if duplicate
   */
  const addApplication = async (jobData) => {
    try {
      // Check for duplicates
      const isDuplicate = applications.some((app) => app.jobId === jobData.jobId);
      if (isDuplicate) {
        throw new Error('This job is already saved!');
      }

      const newApplication = await saveJobApplication(jobData);
      setApplications((prev) => [...prev, newApplication]);
      return newApplication;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Update an existing application (e.g., change status)
   * @param {string} id - Application ID
   * @param {Object} updates - Fields to update
   */
  const updateApplicationStatus = async (id, updates) => {
    try {
      const updatedApp = await updateApplication(id, updates);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updatedApp : app))
      );
      return updatedApp;
    } catch (err) {
      throw err;
    }
  };

  /**
   * Remove an application from the dashboard
   * @param {string} id - Application ID
   */
  const removeApplication = async (id) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      throw err;
    }
  };

  /**
   * Check if a specific job is already tracked
   * @param {number} jobId - Remotive job ID
   * @returns {boolean}
   */
  const isJobTracked = (jobId) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const value = {
    applications,
    loading,
    error,
    loadApplications,
    addApplication,
    updateApplicationStatus,
    removeApplication,
    isJobTracked,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};