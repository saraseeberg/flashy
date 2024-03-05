import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

vi.mock("./hooks/useAuth", () => ({
  useAuth: vi.fn().mockReturnValue({ isAuthenticated: false }),
}));

describe("App", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument;
  });
});

describe("App routing", () => {
  it("should render the login page when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
  });
});
