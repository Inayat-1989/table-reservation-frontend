import { useCallback, useEffect, useState } from "react";

import {
  getDashboardSummary,
  getReservationTrends,
  getPeakHours,
  getSlotPopularity,
  getTrendingFoodItems,
} from "../services/dashboardService";

export default function useAdminDashboard() {
  const [data, setData] = useState({
    summary: null,
    trends: null,
    peakHours: null,
    slotPopularity: null,
    trendingFoodItems: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [summary, trends, peakHours, slotPopularity, trendingFoodItems] =
        await Promise.all([
          getDashboardSummary(),
          getReservationTrends(),
          getPeakHours(),
          getSlotPopularity(),
          getTrendingFoodItems(),
        ]);

      setData({
        summary,
        trends,
        peakHours,
        slotPopularity,
        trendingFoodItems,
      });
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, [loadDashboard]);

  return {
    ...data,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
