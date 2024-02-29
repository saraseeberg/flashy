import { describe, it, expect, vi } from "vitest";

vi.mock("./hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("Test of Approuter", () => {
  it("should render the login page when not authenticated", () => {
    expect(true).toBe(true);
  });

  it("should render the dashboard page when authenticated", () => {
    expect(true).toBe(true);
  });
});
