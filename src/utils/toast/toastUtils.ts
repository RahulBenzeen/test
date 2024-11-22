// src/utils/toastUtil.ts
import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the available types for the toast
type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Utility function for showing different types of toast notifications.
 * @param message - The message to display in the toast.
 * @param type - The type of the toast ('success', 'error', 'info', 'warning').
 * @param options - Additional options for customization.
 */
const showToast = (message: string, type: ToastType, options: ToastOptions = {}) => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options, // Allow override of options
  };

  // Show toast based on the type
  switch (type) {
    case 'success':
      toast.success(message, defaultOptions);
      break;
    case 'error':
      toast.error(message, defaultOptions);
      break;
    case 'info':
      toast.info(message, defaultOptions);
      break;
    case 'warning':
      toast.warning(message, defaultOptions);
      break;
    default:
      toast(message, defaultOptions);
      break;
  }
};

export default showToast;
