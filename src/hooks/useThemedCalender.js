import { useState } from "react";

import { getTimeNow } from "../utils/locationDateTimeUtils";

export const useThemedCalendar = () => {
  const [today] = useState(() => getTimeNow("midnight"));

  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const handlePrevMonth = () => {
    setViewDate((previousDate) => {
      const currentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );

      const previousMonth = new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() - 1,
        1,
      );

      if (previousMonth < currentMonth) {
        return previousDate;
      }

      return previousMonth;
    });
  };

  const handleNextMonth = () => {
    setViewDate((previousDate) => {
      return new Date(
        previousDate.getFullYear(),
        previousDate.getMonth() + 1,
        1,
      );
    });
  };

  const handleDateSelect = (date) => {
    setViewDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
      ),
    );
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const totalDays = new Date(year, month + 1, 0).getDate();

  const startDay = new Date(year, month, 1).getDay();

  const calendarDays = [];

  for (let index = 0; index < startDay; index++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);

    const monthString = String(month + 1).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");

    const dateString = `${year}-${monthString}-${dayString}`;

    const isDisabled = date < today;

    calendarDays.push({
      day,
      date,
      dateStr: dateString,
      isDisabled,
    });
  }

  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === today.getMonth();

  return {
    state: {
      calendarDays,
      viewDate,
      today,
      isCurrentMonth,
    },

    actions: {
      handleDateSelect,
      handleNextMonth,
      handlePrevMonth,
    },
  };
};