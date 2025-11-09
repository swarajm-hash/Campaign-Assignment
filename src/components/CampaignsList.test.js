// Mock axios before importing userSlice
jest.mock("axios", () => ({
  get: jest.fn(),
  default: {
    get: jest.fn(),
  },
}));

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import CampaignsList from "./CampaignsList";
import { configureStore } from "@reduxjs/toolkit";
import campaignsReducer from "../store/slices/campaignSlice";
import usersReducer from "../store/slices/userSlice";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      campaigns: campaignsReducer,
      users: usersReducer,
    },
    preloadedState: {
      campaigns: {
        campaigns: [],
        searchTerm: "",
        dateRange: { startDate: null, endDate: null },
        ...initialState.campaigns,
      },
      users: {
        users: [],
        loading: false,
        error: null,
        ...initialState.users,
      },
    },
  });
};

describe("CampaignsList", () => {
  test("renders camapigns table headers", () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <CampaignsList />
      </Provider>
    );

    expect(screen.getByText("Campaign Name")).toBeInTheDocument();
    expect(screen.getByText("User Name")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
  });

  test("renders campaigns in table body", () => {
    const store = createMockStore({
      campaigns: {
        campaigns: [
          {
            id: 1,
            name: "Test Campaign",
            startDate: "1/1/2022",
            endDate: "1/1/2022",
            Budget: 1000,
            userId: 1,
          },
        ],
        searchTerm: "",
        dateRange: { startDate: null, endDate: null },
      },
      users: {
        users: [{ id: 1, name: "Test User" }],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <CampaignsList />
      </Provider>
    );

    expect(screen.getByText("Test Campaign")).toBeInTheDocument();
  });

  test("displays Unknown User when user not found", () => {
    const store = createMockStore({
      campaigns: {
        campaigns: [
          {
            id: 1,
            name: "Test Campaign",
            startDate: "1/1/2022",
            endDate: "1/1/2022",
            Budget: 1000,
            userId: 1,
          },
        ],
        searchTerm: "",
        dateRange: { startDate: null, endDate: null },
      },
      users: {
        users: [],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <CampaignsList />
      </Provider>
    );

    expect(screen.getByText("Unknown User")).toBeInTheDocument();
  });
});
