import campaignsReducer, {
  addCampaigns,
  setSearchTerm,
  setDateRange,
} from "./campaignSlice";

describe("campaignSlice", () => {
  const initialState = {
    campaigns: [],
    searchTerm: "",
    dateRange: {
      startDate: null,
      endDate: null,
    },
  };

  test("should return the initial state", () => {
    const state = campaignsReducer(undefined, { type: "unknown" });
    expect(state).toHaveProperty("campaigns");
    expect(state).toHaveProperty("searchTerm");
    expect(state).toHaveProperty("dateRange");
    expect(Array.isArray(state.campaigns)).toBe(true);
  });

  test("should handle addCampaigns", () => {
    const newCampaigns = [
      {
        id: 11,
        name: "Test Campaign",
        startDate: "2021/01/01",
        endDate: "2021/01/01",
        Budget: 1000,
        userId: 1,
      },
    ];
    const action = addCampaigns(newCampaigns);
    const state = campaignsReducer(initialState, action);
    expect(state.campaigns).toHaveLength(newCampaigns.length);
    expect(state.campaigns[0].name).toBe("Test Campaign");
  });

  test("should append camapigns when addCampaigns is called with multiple times", () => {
    const firstCampaigns = [{ id: 11, name: "Camapign 1" }];
    const secondCampaigns = [{ id: 12, name: "Camapign 2" }];

    let state = campaignsReducer(initialState, addCampaigns(firstCampaigns));
    state = campaignsReducer(state, addCampaigns(secondCampaigns));

    expect(state.campaigns).toHaveLength(2);
    expect(state.campaigns[0].name).toBe("Camapign 1");
    expect(state.campaigns[1].name).toBe("Camapign 2");
  });

  test("should handle setSearchTerm", () => {
    const action = setSearchTerm("test");
    const state = campaignsReducer(initialState, action);
    expect(state.searchTerm).toBe("test");
  });

  test("should handle setDateRange", () => {
    const dateRange = { startDate: "2021-01-01", endDate: "2021-01-01" };
    const action = setDateRange(dateRange);
    const state = campaignsReducer(initialState, action);
    expect(state.dateRange).toEqual(dateRange);
  });

  test("should handle setdateRange with endDate before startDate", () => {
    const firstRange = { startDate: "2024-01-01", endDate: null };
    let state = campaignsReducer(initialState, setDateRange(firstRange));
    expect(state.dateRange.startDate).toBe("2024-01-01");
    expect(state.dateRange.endDate).toBe(null);

    const secondRange = { startDate: "2024-01-01", endDate: "2024-12-31" };
    state = campaignsReducer(state, setDateRange(secondRange));
    expect(state.dateRange.endDate).toBe("2024-12-31");
  });
});
