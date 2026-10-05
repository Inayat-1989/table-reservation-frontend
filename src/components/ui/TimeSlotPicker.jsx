import { useState } from "react";

import "../../assets/css/TimeSlotPicker.css";

const TimeSlotPicker = ({
  selectedDate,
  availableSlots = [],
  selectedSlot,
  onSlotSelect,
  isLoading = false,
  error = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!selectedDate) {
    return (
      <button
        type="button"
        className="form-control text-start text-muted"
        disabled
      >
        <i className="bi bi-clock me-2"></i>
        Select a date first
      </button>
    );
  }

  if (isLoading) {
    return (
      <button
        type="button"
        className="form-control text-start text-muted"
        disabled
      >
        <i className="bi bi-hourglass-split me-2"></i>
        Loading available times...
      </button>
    );
  }

  if (error) {
    return (
      <button
        type="button"
        className="form-control text-start text-danger"
        disabled
      >
        <i className="bi bi-exclamation-circle me-2"></i>
        Unable to load times
      </button>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <button
        type="button"
        className="form-control text-start text-muted"
        disabled
      >
        <i className="bi bi-clock me-2"></i>
        No available times
      </button>
    );
  }

  const formatSlotTime = (startsAt) => {
    const date = new Date(startsAt);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleTimeSelect = (slot) => {
    onSlotSelect(slot);
    setIsOpen(false);
  };

  return (
    <div className="time-picker">

      {/* Selected Time Button */}
      <button
        type="button"
        className="form-control time-picker-button"
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <i className="bi bi-clock"></i>

        <span>
          {selectedSlot
            ? formatSlotTime(selectedSlot.starts_at)
            : "Select a time"}
        </span>

        <i
          className={`bi ms-auto ${
            isOpen
              ? "bi-chevron-up"
              : "bi-chevron-down"
          }`}
        ></i>
      </button>

      {/* Time Slot Dropdown */}
      {isOpen && (
        <div className="time-picker-dropdown">
          {availableSlots.map((slot) => {
            const isSelected =
              selectedSlot?.id === slot.id;

            return (
              <button
                key={slot.id}
                type="button"
                className={`time-picker-option ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => handleTimeSelect(slot)}
              >
                <span>
                  {formatSlotTime(slot.starts_at)}
                </span>

                {isSelected && (
                  <i className="bi bi-check2"></i>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;