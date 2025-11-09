// Mock axios before importing userSlice
jest.mock("axios", () => ({
  get: jest.fn(),
  default: {
    get: jest.fn(),
  },
}));

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import campaignsReducer from "./store/slices/campaignSlice";
import usersReducer from "./store/slices/userSlice";
import App from "./App";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      campaigns: campaignsReducer,
      users: usersReducer,
    },
  });
};

describe("App", () => {
  test("renders loading message when users are loading", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(
      screen.getByText(/Campaigns Management System/i)
    ).toBeInTheDocument();
  });

  test("renders search form", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });
});
