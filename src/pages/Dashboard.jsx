import { useState } from 'react';
import { useJobs } from '../context/JobContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { Trash2, ExternalLink, AlertCircle } from 'lucide-react';

/**
 * Dashboard Page:  Manage saved job applications
 * Features: View, Update Status, Delete applications
 */
const Dashboard = () => {
  const { applications, loading, updateApplicationStatus, removeApplication } = useJobs();
  const { toast, showToast } = useToast();
  const [updatingId, setUpdatingId] = useState(null);

  /**
   * Status options for applications
   */
  const STATUS_OPTIONS = [
    { value: 'saved', label: 'Saved', color: 'bg-gray-100 text-gray-800' },
    { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-800' },
    { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'offer', label:  'Offer', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color:  'bg-red-100 text-red-800' },
  ];

  /**
   * Handle status change via PATCH request
   * @param {string} id - Application ID
   * @param {string} newStatus - New status value
   */
  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await updateApplicationStatus(id, { status: newStatus });
      showToast('Status updated successfully! ', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  /**
   * Handle application deletion via DELETE request
   * @param {string} id - Application ID
   */
  const handleDelete = async (id) => {
    if (! window.confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await removeApplication(id);
      showToast('Application deleted successfully!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  /**
   * Get status styling
   */
  const getStatusStyle = (status) => {
    const statusObj = STATUS_OPTIONS.find((opt) => opt.value === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast && <Toast message={toast. message} type={toast.type} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
        <p className="text-gray-600">
          Track and manage your job applications ({applications.length} total)
        </p>
      </div>

      {/* Empty State */}
      {applications. length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto text-blue-500 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            No Applications Yet
          </h3>
          <p className="text-blue-700 mb-4">
            Start tracking jobs from the job board to see them here. 
          </p>
          <a href="/" className="btn-primary inline-block">
            Browse Jobs
          </a>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saved On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{app.title}</span>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{app.company}</td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                          app.status
                        )} border-0 focus:ring-2 focus:ring-primary`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(app.savedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{app.title}</h3>
                    <p className="text-gray-600 text-sm">{app.company}</p>
                  </div>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Status: </label>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    disabled={updatingId === app.id}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Saved:  {formatDate(app.savedAt)}
                  </span>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
