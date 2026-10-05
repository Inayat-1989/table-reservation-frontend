import { apiRequest } from "./client";

export const getSlotsByDate = async (date) => {
    const dateString = formatDateForApi(date);

    return apiRequest(`/slots/?date=${dateString}`);
};

const formatDateForApi = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        throw new Error("A valid Date object is required.");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};