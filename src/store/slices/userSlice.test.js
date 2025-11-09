import usersReducer, { fetchUsers } from "./userSlice";

// Mock axios before importing userSlice
jest.mock("axios", () => ({
  get: jest.fn(),
  default: {
    get: jest.fn(),
  },
}));

describe("userSlice", () => {
  const initialState = {
    users: [],
    loading: false,
    error: null,
  };

  test("should return the initial state", () => {
    expect(usersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle fetchUsers.pending", () => {
    const action = { type: fetchUsers.pending.type };
    const state = usersReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test("should handle fetchUsers.fulfilled", () => {
    const mockUsers = [
      {
        id: 1,
        name: "Swaraj Mestry",
      },
      {
        id: 2,
        name: "Shreeyash Sansare",
      },
    ];
    const action = { type: fetchUsers.fulfilled.type, payload: mockUsers };
    const state = usersReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.users).toEqual(mockUsers);
    expect(state.error).toBe(null);
  });

  test("should handle fetchUsers.rejected", () => {
    const action = {
      type: fetchUsers.rejected.type,
      error: { message: "Network Error" },
    };
    const state = usersReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.users).toEqual([]);
    expect(state.error).toBe("Network Error");
  });

  test("Should reset error on pending", () => {
    const errorState = {
      users: [],
      loading: false,
      error: "Network Error",
    };
    const action = { type: fetchUsers.pending.type };
    const state = usersReducer(errorState, action);
    expect(state.error).toBe(null);
  });
});
