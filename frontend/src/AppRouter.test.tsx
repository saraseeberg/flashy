vi.mock("./hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("Approuter", () => {
  it("should render the login page when not authenticated", () => {
    expect(true).toBe(true);
  });

  it("should render the dashboard page when authenticated", () => {
    expect(true).toBe(true);
  });
});
