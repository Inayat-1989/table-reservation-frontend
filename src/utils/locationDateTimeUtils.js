const location = {
  id: "Downtown",
  name: "Downtown",
  address: "100 Culinary Way, Suite 400",
  phone: "+92 341 5054871",
  status: "Open Now",
  totalSeats: 48,
  open: "10:30",
  close: "22:00",
  label: "11:00 AM – 10:00 PM",
};

export const getToday = () => {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
};

export const getTimeNow = (condition) => {
  const now = new Date();

  if (condition === "midnight") {
    now.setHours(0, 0, 0, 0);

    return now;
  }

  if (condition === "adjusted") {
    return adjustTime(now);
  }

  return now;
};

export const adjustTime = (dateObj) => {
  const date = new Date(dateObj);

  const minutes = date.getMinutes();

  if (minutes === 0) {
    date.setSeconds(0, 0);
  } else if (minutes <= 30) {
    date.setMinutes(30, 0, 0);
  } else {
    date.setHours(date.getHours() + 1, 0, 0, 0);
  }

  return date;
};

export const parseValueFromDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDatefromValue = (date) => {
  if (!date) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);

  return adjustTime(new Date(year, month - 1, day));
};

export const formatDisplayTime = (dateObj) => {
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const period = hours >= 12 ? "PM" : "AM";

  const hours12 = hours % 12 === 0 ? 12 : hours % 12;

  const pad2 = (number) => String(number).padStart(2, "0");

  return `${pad2(hours12)}:${pad2(minutes)} ${period}`;
};

export const calculateAvailableTimeSlots = (selectedDate) => {
  if (
    !selectedDate ||
    !(selectedDate instanceof Date) ||
    isNaN(selectedDate.getTime()) ||
    !location
  ) {
    return [];
  }

  const now = getTimeNow("adjusted");

  const [openHour, openMinute] = location.open.split(":").map(Number);

  const [closeHour, closeMinute] = location.close.split(":").map(Number);

  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const openDateTime = new Date(selectedDate);

  openDateTime.setHours(openHour, openMinute, 0, 0);

  const closeDateTime = new Date(selectedDate);

  closeDateTime.setHours(closeHour, closeMinute, 0, 0);

  // The restaurant has already closed today.
  if (isToday && closeDateTime <= now) {
    return [];
  }

  // For today, start from the next available
  // 30-minute interval.
  if (isToday) {
    return get30MinList(now > openDateTime ? now : openDateTime, closeDateTime);
  }

  // Future date.
  return get30MinList(openDateTime, closeDateTime);
};

const get30MinList = (startDateTime, endDateTime) => {
  if (!startDateTime || !endDateTime) {
    return [];
  }

  let current = adjustTime(new Date(startDateTime));

  const end = new Date(endDateTime);

  const slots = [];

  while (current < end) {
    slots.push({
      value24: new Date(current),
      display12: formatDisplayTime(current),
    });

    current = new Date(current.getTime() + 30 * 60 * 1000);
  }

  return slots;
};

export const isLessThan24HoursAway = (targetDate) => {
  if (
    !targetDate ||
    !(targetDate instanceof Date) ||
    isNaN(targetDate.getTime())
  ) {
    return false;
  }

  const now = getTimeNow("adjusted");

  const difference = targetDate.getTime() - now.getTime();

  const twentyFourHours = 24 * 60 * 60 * 1000;

  return difference >= 0 && difference < twentyFourHours;
};
