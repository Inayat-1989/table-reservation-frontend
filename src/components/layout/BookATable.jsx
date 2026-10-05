import { useState } from "react";

import { createDraftReservation } from "../../api/reservationApi";

import reservation from "../../assets/img/reservation.jpg";
import ThemedCalendar from "../ui/ThemedCalendar";
import TimeSlotPicker from "../ui/TimeSlotPicker";
import useTimeSlots from "../../hooks/useTimeSlots";


const BookATable = ({ onBookingSubmit }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [partySizeError, setPartySizeError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    availableSlots,
    isLoading: isLoadingSlots,
    error: slotsError,
  } = useTimeSlots(selectedDate);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    people: "",
    message: "",
  });


  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "people") {
      const people = Number(value);

      if (
        selectedSlot &&
        people > selectedSlot.remaining_seats
      ) {
        setPartySizeError(
          `Only ${selectedSlot.remaining_seats} seat(s) remain for this time.`,
        );
      } else {
        setPartySizeError("");
      }
    }

    setSubmitError("");

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };


  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setPartySizeError("");
    setSubmitError("");
    setIsCalendarOpen(false);

    setFormData((previousData) => ({
      ...previousData,
      people: "",
    }));
  };


  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setPartySizeError("");
    setSubmitError("");

    setFormData((previousData) => ({
      ...previousData,
      people: "",
    }));
  };


  const isSpecialMenuEligible = () => {
    if (!selectedSlot?.starts_at) {
      return false;
    }

    const slotDateTime = new Date(
      selectedSlot.starts_at,
    );

    const now = new Date();

    const twentyFourHours = 24 * 60 * 60 * 1000;

    return (
      slotDateTime.getTime() - now.getTime() >=
      twentyFourHours
    );
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (isSubmitting) {
      return;
    }

    if (!selectedSlot) {
      setSubmitError(
        "Please select a date and time before continuing.",
      );

      return;
    }

    const guestCount = Number(formData.people);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1
    ) {
      setPartySizeError(
        "Please select a valid party size.",
      );

      return;
    }

    if (
      guestCount > selectedSlot.remaining_seats
    ) {
      setPartySizeError(
        `Only ${selectedSlot.remaining_seats} seat(s) remain for this time.`,
      );

      return;
    }

    const draftData = {
      full_name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      slot_id: selectedSlot.id,
      guest_count: guestCount,
      customer_note: formData.message.trim(),
    };

    try {
      setIsSubmitting(true);

      const reservation =
        await createDraftReservation(draftData);

      console.log(
        "Book A Table : Draft Reservation:",
        reservation,
      );

      onBookingSubmit(reservation);
    } catch (error) {
      console.error(
        "Book A Table : Failed to create draft reservation:",
        error,
      );

      if (
        error.code === "SLOT_CAPACITY_EXCEEDED"
      ) {
        setSubmitError(
          "This time slot no longer has enough available seats. Please select another time.",
        );
      } else if (
        error.code === "RESERVATION_ERROR"
      ) {
        setSubmitError(
          error.message ||
            "The reservation could not be created. Please try again.",
        );
      } else {
        setSubmitError(
          error.message ||
            "Something went wrong while creating your reservation. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const remainingSeats =
    selectedSlot?.remaining_seats ?? null;

  const showSpecialMenuWarning =
    selectedSlot &&
    !isSpecialMenuEligible();


  return (
    <section
      id="book-a-table"
      className="book-a-table section"
    >
      {/* Section Title */}
      <div className="container section-title">
        <h2>Book A Table</h2>

        <p>
          <span>Book Your</span>{" "}
          <span className="description-title">
            Stay With Us
            <br />
          </span>
        </p>
      </div>

      <div className="container">
        <div className="row g-0">

          {/* Reservation Image */}
          <div
            className="col-lg-4 reservation-img"
            style={{
              backgroundImage: `url(${reservation})`,
            }}
          ></div>


          {/* Reservation Form */}
          <div className="col-lg-8 d-flex align-items-center reservation-form-bg">
            <form
              onSubmit={handleSubmit}
              role="form"
              className="php-email-form"
            >
              <div className="row gy-4">

                {/* Name */}
                <div className="col-lg-4 col-md-6">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>


                {/* Email */}
                <div className="col-lg-4 col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>


                {/* Phone */}
                <div className="col-lg-4 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    id="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>


                {/* Date */}
                <div className="col-lg-4 col-md-6">
                  <div className="date-picker">
                    <button
                      type="button"
                      className="form-control date-picker-button"
                      onClick={() =>
                        setIsCalendarOpen(
                          (previous) => !previous,
                        )
                      }
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-calendar3"> </i>

                      <span>
                        {selectedDate
                          ? selectedDate.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "Select a date"}
                      </span>

                      <i
                        className={`bi ms-auto ${
                          isCalendarOpen
                            ? "bi-chevron-up"
                            : "bi-chevron-down"
                        }`}
                      ></i>
                    </button>

                    {isCalendarOpen && (
                      <div className="date-picker-dropdown">
                        <ThemedCalendar
                          onDateSelect={handleDateSelect}
                        />
                      </div>
                    )}
                  </div>
                </div>


                {/* Time */}
                <div className="col-lg-4 col-md-6">
                  <TimeSlotPicker
                    selectedDate={selectedDate}
                    availableSlots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                    isLoading={isLoadingSlots}
                    error={slotsError}
                  />
                </div>


                {/* Number of People */}
                <div className="col-lg-4 col-md-6">
                  <select
                    name="people"
                    className="form-control"
                    value={formData.people}
                    onChange={handleChange}
                    required
                    disabled={
                      !selectedSlot ||
                      selectedSlot.remaining_seats <= 0 ||
                      isSubmitting
                    }
                  >
                    <option value="">
                      {!selectedSlot
                        ? "Select a time first"
                        : "Select party size"}
                    </option>

                    {selectedSlot &&
                      Array.from(
                        {
                          length:
                            selectedSlot.remaining_seats,
                        },
                        (_, index) => {
                          const people = index + 1;

                          return (
                            <option
                              key={people}
                              value={people}
                            >
                              {people}{" "}
                              {people === 1
                                ? "Person"
                                : "People"}
                            </option>
                          );
                        },
                      )}
                  </select>


                  {/* Remaining Seats */}
                  {selectedSlot && (
                    <small className="text-muted d-block mt-2">
                      {remainingSeats === 1
                        ? "1 seat remains for this time."
                        : `${remainingSeats} seats remain for this time.`}
                    </small>
                  )}


                  {/* Party Size Error */}
                  {partySizeError && (
                    <small className="text-danger d-block mt-2">
                      {partySizeError}
                    </small>
                  )}
                </div>
              </div>


              {/* Special Menu Warning */}
              {showSpecialMenuWarning && (
                <div
                  className="alert alert-warning mt-4"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>

                  Special menu is not available for
                  reservations made within 24 hours.
                  You can still continue with your
                  reservation.
                </div>
              )}


              {/* Backend Error */}
              {submitError && (
                <div
                  className="alert alert-danger mt-4"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle me-2"></i>

                  {submitError}
                </div>
              )}


              {/* Message */}
              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  name="message"
                  rows="5"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>


              {/* Submit */}
              <div className="text-center mt-3">
                <button
                  type="submit"
                  disabled={
                    !selectedSlot ||
                    Boolean(partySizeError) ||
                    isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Creating Reservation..."
                    : "Continue"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookATable;