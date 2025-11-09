import {
  formatDate,
  formatBudget,
  ifCampaignActive,
  getUserName,
  filterCampaigns,
  filterByDateRange,
  getAllFilteredCampaigns,
} from "./helpers";

describe("formatDate", () => {
  test("formats date correctly to DD/MM/YYYY", () => {
    expect(formatDate("9/19/2021")).toBe("19/09/2021");
    expect(formatDate("11/21/2023")).toBe("21/11/2023");
    expect(formatDate("1/5/2022")).toBe("05/01/2022");
  });

  test("returns empty string for null or undefined", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
    expect(formatDate("")).toBe("");
  });
});

describe("formatBudget", () => {
  test("formats budget less than 1000", () => {
    expect(formatBudget(500)).toBe("500.00 USD");
    expect(formatBudget(999)).toBe("999.00 USD");
  });

  test("formats budget in thousands", () => {
    expect(formatBudget(1000)).toBe("1.00K USD");
    expect(formatBudget(5000)).toBe("5.00K USD");
    expect(formatBudget(10000)).toBe("10.00K USD");
  });

  test("formats budget in millions", () => {
    expect(formatBudget(1000000)).toBe("1.00M USD");
    expect(formatBudget(5000000)).toBe("5.00M USD");
  });

  test("returns empty string for null or undefined", () => {
    expect(formatBudget(null)).toBe("");
    expect(formatBudget(undefined)).toBe("");
  });
});

describe("ifCampaignActive", () => {
  test("returns true for active campaign", () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 10);

    expect(
      ifCampaignActive(
        startDate.toLocaleDateString("en-US"),
        endDate.toLocaleDateString("en-US")
      )
    ).toBe(true);
  });

  test("returns false for past campaign", () => {
    expect(ifCampaignActive("1/1/2020", "12/31/2020")).toBe(false);
  });

  test("returns false for future campaign", () => {
    // Use a date far in the future to ensure it's always inactive
    expect(ifCampaignActive("1/1/2030", "12/31/2030")).toBe(false);
  });

  test("returns false for missing dates", () => {
    expect(ifCampaignActive(null, "12/31/2020")).toBe(false);
    expect(ifCampaignActive("1/1/2020", null)).toBe(false);
    expect(ifCampaignActive(null, null)).toBe(false);
  });
});

describe("getUserName", () => {
  const mockUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];

  test("returns user name when found", () => {
    expect(getUserName(1, mockUsers)).toBe("John Doe");
    expect(getUserName(2, mockUsers)).toBe("Jane Smith");
  });

  test("returns Unknown User when user not found", () => {
    expect(getUserName(999, mockUsers)).toBe("Unknown User");
  });

  test("returns Unknown User for empty users array", () => {
    expect(getUserName(1, [])).toBe("Unknown User");
  });

  test("returns Unknown User for null userId", () => {
    expect(getUserName(null, mockUsers)).toBe("Unknown User");
  });

  test("returns Unknown User for null users", () => {
    expect(getUserName(1, null)).toBe("Unknown User");
  });
});

describe("filterCampaigns", () => {
  const mockCampaigns = [
    { id: 1, name: "Divavu" },
    { id: 2, name: "Jaxspan" },
    { id: 3, name: "Miboo" },
  ];

  test("filters campaigns by name case-insensitive", () => {
    expect(filterCampaigns(mockCampaigns, "div")).toEqual([
      { id: 1, name: "Divavu" },
    ]);
    expect(filterCampaigns(mockCampaigns, "JAX")).toEqual([
      { id: 2, name: "Jaxspan" },
    ]);
  });

  test("returns all campaigns for empty search term", () => {
    expect(filterCampaigns(mockCampaigns, "")).toEqual(mockCampaigns);
    expect(filterCampaigns(mockCampaigns, "   ")).toEqual(mockCampaigns);
  });

  test("returns empty array when no match found", () => {
    expect(filterCampaigns(mockCampaigns, "xyz")).toEqual([]);
  });
});

describe("filterByDateRange", () => {
  const mockCampaigns = [
    {
      id: 1,
      name: "Campaign 1",
      startDate: "1/1/2022",
      endDate: "12/31/2022",
    },
    {
      id: 2,
      name: "Campaign 2",
      startDate: "1/1/2023",
      endDate: "12/31/2023",
    },
    {
      id: 3,
      name: "Campaign 3",
      startDate: "1/1/2021",
      endDate: "12/31/2021",
    },
  ];

  test("filters campaigns by date range - startDate in range", () => {
    const result = filterByDateRange(mockCampaigns, "2022-01-01", "2022-12-31");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  test("filters campaigns by date range - endDate in range", () => {
    const result = filterByDateRange(mockCampaigns, "2021-01-01", "2021-12-31");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  test("returns empty array if end date before start date", () => {
    const result = filterByDateRange(mockCampaigns, "2022-12-31", "2022-01-01");
    expect(result).toEqual([]);
  });

  test("returns all campaigns if no date range provided", () => {
    expect(filterByDateRange(mockCampaigns, null, null)).toEqual(mockCampaigns);
    expect(filterByDateRange(mockCampaigns, "", "")).toEqual(mockCampaigns);
  });

  test("filters out campaigns where endDate is before startDate", () => {
    const campaignsWithInvalid = [
      {
        id: 1,
        name: "Valid",
        startDate: "1/1/2022",
        endDate: "12/31/2022",
      },
      {
        id: 2,
        name: "Invalid",
        startDate: "12/31/2022",
        endDate: "1/1/2022",
      },
    ];
    const result = filterByDateRange(
      campaignsWithInvalid,
      "2022-01-01",
      "2022-12-31"
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Valid");
  });
});

describe("getAllFilteredCampaigns", () => {
  const mockCampaigns = [
    {
      id: 1,
      name: "Divavu",
      startDate: "1/1/2022",
      endDate: "12/31/2022",
    },
    {
      id: 2,
      name: "Jaxspan",
      startDate: "1/1/2023",
      endDate: "12/31/2023",
    },
  ];

  test("filters by search term only", () => {
    const dateRange = { startDate: null, endDate: null };
    const result = getAllFilteredCampaigns(mockCampaigns, "div", dateRange);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Divavu");
  });

  test("filters by date range only", () => {
    const dateRange = { startDate: "2022-01-01", endDate: "2022-12-31" };
    const result = getAllFilteredCampaigns(mockCampaigns, "", dateRange);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Divavu");
  });

  test("filters by both search term and date range", () => {
    const dateRange = { startDate: "2022-01-01", endDate: "2022-12-31" };
    const result = getAllFilteredCampaigns(mockCampaigns, "div", dateRange);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Divavu");
  });

  test("returns empty array when no matches", () => {
    const dateRange = { startDate: "2022-01-01", endDate: "2022-12-31" };
    const result = getAllFilteredCampaigns(mockCampaigns, "xyz", dateRange);
    expect(result).toEqual([]);
  });
});
