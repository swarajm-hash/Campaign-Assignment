import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import SearchForm from "./SearchForm";
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

describe("SearchForm", () => {
  test("should render input ", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  test("renders button of search", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
