import { useThemedCalendar } from "../../hooks/useThemedCalender.js";

import "../../assets/css/ThemedCalender.css";

const ThemedCalendar = ({ onDateSelect }) => {
  const { state, actions } = useThemedCalendar();

  const {
    calendarDays,
    viewDate,
    isCurrentMonth,
  } = state;

  const {
    handleDateSelect,
    handleNextMonth,
    handlePrevMonth,
  } = actions;

  return (
    <div className="calendar-container bg-white border rounded-3 shadow-sm p-3">

      {/* Calendar Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">

        {/* Previous Month */}
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={isCurrentMonth}
          className="btn btn-sm calendar-nav-btn"
          aria-label="Previous month"
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {/* Current Month / Year */}
        <span className="fw-semibold text-dark">
          {viewDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        {/* Next Month */}
        <button
          type="button"
          onClick={handleNextMonth}
          className="btn btn-sm calendar-nav-btn"
          aria-label="Next month"
        >
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      {/* Weekday Header */}
      <div className="calendar-weekdays mb-2">
        {[
          "Su",
          "Mo",
          "Tu",
          "We",
          "Th",
          "Fr",
          "Sa",
        ].map((day) => (
          <div
            key={day}
            className="calendar-weekday"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="calendar-days">
        {calendarDays.map((item, index) => {

          if (!item) {
            return (
              <div
                key={`empty-${index}`}
                className="calendar-empty"
              />
            );
          }

          return (
            <button
              key={item.dateStr}
              type="button"
              disabled={item.isDisabled}
              onClick={() => {
                onDateSelect(item.date);
                handleDateSelect(item.date);
              }}
              className={`calendar-day ${
                item.isDisabled ? "disabled" : ""
              }`}
              aria-label={item.date.toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemedCalendar;