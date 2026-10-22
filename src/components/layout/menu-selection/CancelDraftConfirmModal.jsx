import '../../../assets/css/CancelDraftConfirmModal.css';

const CancelDraftConfirmModal = ({ isCancelling, error, onConfirm, onClose }) => {
  return (
    <div
      className="cancel-draft-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isCancelling) {
          onClose();
        }
      }}
    >
      <section
        className="cancel-draft-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-draft-title"
        aria-describedby="cancel-draft-description"
      >
        <div className="cancel-draft-icon">
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />
        </div>

        <h2 id="cancel-draft-title">Cancel This Reservation?</h2>

        <p id="cancel-draft-description">
          Are you sure you want to cancel your draft reservation? Your current booking progress will
          be lost, and this action cannot be undone.
        </p>

        {error && (
          <div className="cancel-draft-error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="cancel-draft-actions">
          <button
            type="button"
            className="cancel-draft-btn cancel-draft-btn-secondary"
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep Booking
          </button>

          <button
            type="button"
            className="cancel-draft-btn cancel-draft-btn-danger"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <span className="cancel-draft-spinner" aria-hidden="true" />
                Cancelling...
              </>
            ) : (
              <>
                <i className="bi bi-trash3" aria-hidden="true" />
                Confirm Cancellation
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default CancelDraftConfirmModal;
