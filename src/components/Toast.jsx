import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Toast Notification Component
 */
const Toast = ({ message, type = 'success' }) => {
  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  const Icon = type === 'success' ?  CheckCircle : XCircle;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <Icon size={24} />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
