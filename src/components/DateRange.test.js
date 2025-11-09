import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import DateRange from "./DateRange";
import { configureStore } from "@reduxjs/toolkit";
import campaignsReducer from "../store/slices/campaignSlice";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      campaigns: campaignsReducer,
    },
    preloadedState: {
      campaigns: {
        campaigns: [],
        searchTerm: "",
        dateRange: { startDate: null, endDate: null },
        ...initialState.campaigns,
      },
    },
  });
};

describe("DateRange", () => {
  test("should render start date input", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <DateRange />
      </Provider>
    );
    const startDateInput = screen.getByPlaceholderText("Start-Date");
    expect(startDateInput).toBeInTheDocument();
    expect(startDateInput).toHaveAttribute("type", "date");
  });

  test("end date input is disabled when start date is not selected", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <DateRange />
      </Provider>
    );
    const endDateInput = screen.getByPlaceholderText("End-Date");
    expect(endDateInput).toBeInTheDocument();
    expect(endDateInput).toBeDisabled();
  });
});
