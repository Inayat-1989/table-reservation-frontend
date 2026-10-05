import { useEffect, useState } from "react";
import { getSlotsByDate } from "../api/slotApi";

const useTimeSlots = (selectedDate) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedDate) {
            setAvailableSlots([]);
            setError(null);
            return;
        }

        const loadSlots = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getSlotsByDate(selectedDate);

                setAvailableSlots(data.slots ?? []);
            } catch (error) {
                console.error("Failed to load time slots:", error);

                setAvailableSlots([]);
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadSlots();
    }, [selectedDate]);

    return {
        availableSlots,
        isLoading,
        error,
    };
};

export default useTimeSlots;