import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDateRange } from "../store/slices/campaignSlice";

const DateRange = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector((state) => state.campaigns.dateRange);

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    if (
      dateRange.endDate &&
      new Date(startDate) > new Date(dateRange.endDate)
    ) {
      dispatch(setDateRange({ startDate, endDate: null }));
    } else {
      dispatch(setDateRange({ startDate, endDate: dateRange.endDate }));
    }
  };

  const handleEndDateChange = (e) => {
    const endDate = e.target.value;
    const startDate = dateRange.startDate;

    if (endDate && new Date(endDate) < new Date(startDate)) {
      alert("Select start date first");
      e.target.value = "";
      return;
    }
    dispatch(setDateRange({ startDate, endDate }));
  };

  return (
    <div className="date-range">
      <input
        type="date"
        value={dateRange.startDate || ""}
        placeholder="Start-Date"
        onChange={handleStartDateChange}
        className="start-date-input"
      />
      <input
        type="date"
        value={dateRange.endDate || ""}
        placeholder="End-Date"
        onChange={handleEndDateChange}
        min={dateRange.startDate || ""}
        disabled={!dateRange.startDate} // Disable if start date not selected
        className="end-date-input"
      />
    </div>
  );
};

export default DateRange;
