import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

/**
 * Main App Component
 * Sets up routing and global providers
 */
function App() {
  return (
    <JobProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </JobProvider>
  );
}

export default App;
