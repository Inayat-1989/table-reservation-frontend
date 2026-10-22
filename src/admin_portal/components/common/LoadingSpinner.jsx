export const LoadingSpinner = ({
  message = 'Loading...',
  size = 'normal',
  color = 'danger',
  fullPage = false,
}) => {
  const spinnerSize = size === 'small' ? 'spinner-border-sm' : '';

  return (
    <div
      className={`text-center ${
        fullPage
          ? 'd-flex flex-column justify-content-center align-items-center min-vh-100'
          : 'py-5'
      }`}
      role="status"
      aria-live="polite"
    >
      <span className={`spinner-border ${spinnerSize} text-${color}`} aria-hidden="true" />

      {message && <p className="mt-3 mb-0">{message}</p>}

      <span className="visually-hidden">{message || 'Loading'}</span>
    </div>
  );
};

export default LoadingSpinner;
