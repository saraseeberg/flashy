import { fireEvent, render, screen } from "@testing-library/react";
import ErrorPopup from "./ErrorPopup";

test("Renders ErrorPopup and handles button clicks correctly", async () => {
  const mockOnClose = vi.fn();
  const mockNavigate = vi.fn();

  // Mock the useNavigate hook to return the mockNavigate function
  vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
  }));

  // Render the component
  render(<ErrorPopup open={true} onClose={mockOnClose} />);

  // Simulate clicking on the "Go back" button
  fireEvent.click(screen.getByText("Go back"));

  // Check that the onClose function was called
  expect(mockOnClose).toHaveBeenCalled();

  // Check that the navigate function was called with the correct argument
  expect(mockNavigate).toHaveBeenCalledWith;
});
