import {
  formatDate,
  formatTime,
  getStatusClass,
  getStatusLabel,
  isCancellationDisabled,
  getCancelButtonLabel,
} from "./reservationUtils";

const ReservationTable = ({
  reservations,
  isCancelling,
  onCancel,
  onSelect,
  getSelectedMenuItems,
}) => {
  return (
    <div className="reservations-table-container">
      <div className="reservations-table-header">
        <h3>Reservation History</h3>

        <span>
          {reservations.length}{" "}
          {reservations.length === 1 ? "reservation" : "reservations"}
        </span>
      </div>

      <div className="table-responsive">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Date &amp; Time Slot</th>
              <th>Guests</th>
              <th>Special Menu</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((reservation) => {
              const selectedItems = getSelectedMenuItems(reservation);
              const hasSpecialItems = selectedItems.some(
                (item) => item.isSpecial,
              );

              return (
                <tr
                  key={reservation.reference_code}
                  className="reservation-table-row"
                  onClick={() => onSelect(reservation.reference_code)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(reservation.reference_code);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`View reservation ${reservation.reference_code}`}
                >
                  <td>
                    <strong className="table-reference">
                      {reservation.reference_code}
                    </strong>
                  </td>

                  <td>
                    <div className="table-datetime">
                      <span>
                        <i className="bi bi-calendar3" />
                        {formatDate(reservation.slot_start)}
                      </span>

                      <span>
                        <i className="bi bi-clock" />
                        {formatTime(reservation.slot_start)}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="table-guests">
                      <i className="bi bi-people" />
                      {reservation.guest_count}{" "}
                      {Number(reservation.guest_count) === 1
                        ? "Guest"
                        : "Guests"}
                    </span>
                  </td>

                  <td>
                    {hasSpecialItems ? (
                      <span className="special-menu-indicator">
                        <i className="bi bi-star-fill" />
                        Special items
                      </span>
                    ) : (
                      <span className="table-muted">—</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`reservation-status ${getStatusClass(
                        reservation.status,
                      )}`}
                    >
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="reservation-cancel-button"
                      disabled={isCancellationDisabled(
                        reservation,
                        isCancelling,
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onCancel(reservation.reference_code);
                      }}
                    >
                      {getCancelButtonLabel(reservation, isCancelling)}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="reservations-table-footer">
        <i className="bi bi-info-circle" />
        Select any reservation row to view its complete details.
      </div>
    </div>
  );
};

export default ReservationTable;
