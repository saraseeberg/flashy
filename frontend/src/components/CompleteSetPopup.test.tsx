import { fireEvent, render, screen } from "@testing-library/react";
import CompleteSetPopup from "./CompleteSetPopup";

test("Renders CompleteSetPopup and handles button clicks correctly", async () => {
  const mockOnRestart = vi.fn();
  const mockNavigate = vi.fn();

  vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
  }));

  // Render the component
  render(<CompleteSetPopup onRestart={mockOnRestart} onClose={mockNavigate} />);

  //Simulate click on Restart learning set
  fireEvent.click(screen.getByText("Restart Learning Set"));
  expect(mockOnRestart).toHaveBeenCalled();

  //Simulate click on Return to Dashboard
  fireEvent.click(screen.getByText("Return to Dashboard"));
  expect(mockNavigate).toHaveBeenCalled();
});
