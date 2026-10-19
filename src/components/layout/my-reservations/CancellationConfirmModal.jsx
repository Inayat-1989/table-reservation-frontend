import "../../../assets/css/CancellationConfirmModal.css";

const CancellationConfirmModal = ({
  reservation,
  isCancelling,
  error,
  onConfirm,
  onClose,
}) => {
  if (!reservation) return null;

  return (
    <div
      className="cancellation-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isCancelling) {
          onClose();
        }
      }}
    >
      <section
        className="cancellation-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancellation-modal-title"
        aria-describedby="cancellation-modal-description"
      >
        <div className="cancellation-modal-icon">
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />
        </div>

        <h2 id="cancellation-modal-title">Cancel Reservation?</h2>

        <p id="cancellation-modal-description">
          Are you sure you want to cancel this reservation? This action may not
          be reversible.
        </p>

        <div className="cancellation-reservation-reference">
          <span>Reservation reference</span>
          <strong>{reservation.reference_code}</strong>
        </div>

        {error && (
          <div className="cancellation-modal-error" role="alert">
            <i className="bi bi-exclamation-circle" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="cancellation-modal-actions">
          <button
            type="button"
            className="cancellation-btn cancellation-btn-secondary"
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep Reservation
          </button>

          <button
            type="button"
            className="cancellation-btn cancellation-btn-danger"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <span className="cancellation-btn-spinner" aria-hidden="true" />
                Cancelling...
              </>
            ) : (
              <>
                <i className="bi bi-trash3" aria-hidden="true" />
                Yes, Cancel Reservation
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default CancellationConfirmModal;
