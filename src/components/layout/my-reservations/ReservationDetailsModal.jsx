import {
  formatDate,
  formatTime,
  getStatusClass,
  getStatusLabel,
  isCancellationDisabled,
} from './reservationUtils';

const ReservationDetailsModal = ({
  reservation,
  selectedItems,
  isCancelling,
  onClose,
  onCancel,
}) => {
  if (!reservation) return null;

  return (
    <div className="reservation-modal-backdrop" onClick={onClose}>
      <div
        className="reservation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reservation-modal-header">
          <div>
            <span className="reservation-reference-label">Reservation Reference</span>

            <h3 id="reservation-modal-title">{reservation.reference_code}</h3>
          </div>

          <button
            type="button"
            className="reservation-modal-close"
            aria-label="Close reservation details"
            onClick={onClose}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="reservation-modal-body">
          <div className="reservation-modal-status">
            <span className={`reservation-status ${getStatusClass(reservation.status)}`}>
              {getStatusLabel(reservation.status)}
            </span>
          </div>

          <div className="reservation-modal-grid">
            <div className="reservation-modal-info">
              <i className="bi bi-person" />
              <div>
                <span>Customer Name</span>
                <strong>{reservation.customer_name || 'Not provided'}</strong>
              </div>
            </div>

            <div className="reservation-modal-info">
              <i className="bi bi-envelope" />
              <div>
                <span>Email</span>
                <strong>{reservation.customer_email || 'Not provided'}</strong>
              </div>
            </div>

            <div className="reservation-modal-info">
              <i className="bi bi-telephone" />
              <div>
                <span>Phone</span>
                <strong>{reservation.customer_phone || 'Not provided'}</strong>
              </div>
            </div>

            <div className="reservation-modal-info">
              <i className="bi bi-calendar-event" />
              <div>
                <span>Date</span>
                <strong>{formatDate(reservation.slot_start)}</strong>
              </div>
            </div>

            <div className="reservation-modal-info">
              <i className="bi bi-clock" />
              <div>
                <span>Time Slot</span>
                <strong>{formatTime(reservation.slot_start)}</strong>
              </div>
            </div>

            <div className="reservation-modal-info">
              <i className="bi bi-people" />
              <div>
                <span>Guests</span>
                <strong>
                  {reservation.guest_count}{' '}
                  {Number(reservation.guest_count) === 1 ? 'Person' : 'People'}
                </strong>
              </div>
            </div>
          </div>

          <div className="reservation-modal-section">
            <h4>Selected Special Menu</h4>

            {selectedItems.length > 0 ? (
              <ul className="reservation-modal-menu">
                {selectedItems.map((item) => (
                  <li key={item.id}>
                    <div>
                      <span>{item.title}</span>

                      {item.isSpecial && (
                        <span className="special-menu-badge">
                          <i className="bi bi-star-fill" /> Special
                        </span>
                      )}
                    </div>

                    <strong>{item.price}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="table-muted">No special menu items selected.</p>
            )}
          </div>

          {reservation.customer_note && (
            <div className="reservation-modal-section">
              <h4>
                <i className="bi bi-chat-left-text me-2" />
                Customer Note
              </h4>

              <p className="reservation-modal-note">{reservation.customer_note}</p>
            </div>
          )}
        </div>

        <div className="reservation-modal-footer">
          <button type="button" className="reservation-modal-done" onClick={onClose}>
            Close
          </button>

          <button
            type="button"
            className="reservation-cancel-button"
            disabled={isCancellationDisabled(reservation, isCancelling)}
            onClick={() => onCancel(reservation.reference_code)}
          >
            {reservation.status === 'CANCELLED'
              ? 'Cancelled'
              : isCancelling
                ? 'Cancelling...'
                : 'Cancel Reservation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsModal;
