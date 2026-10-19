import "../../assets/css/ConfirmActionModal.css";

const ConfirmActionModal = ({
  isOpen,
  title = "Are you sure?",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Go Back",
  isLoading = false,
  error = "",
  variant = "danger",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="confirm-action-backdrop" onMouseDown={handleBackdropClick}>
      <section
        className="confirm-action-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-action-title"
        aria-describedby="confirm-action-message"
      >
        <div className={`confirm-action-icon confirm-action-icon-${variant}`}>
          <i
            className={
              variant === "danger"
                ? "bi bi-exclamation-triangle"
                : "bi bi-question-circle"
            }
            aria-hidden="true"
          />
        </div>

        <h2 id="confirm-action-title">{title}</h2>

        <p id="confirm-action-message">{message}</p>

        {error && (
          <div className="confirm-action-error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="confirm-action-buttons">
          <button
            type="button"
            className="confirm-action-btn confirm-action-btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`confirm-action-btn confirm-action-btn-${variant}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                <span> Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmActionModal;
