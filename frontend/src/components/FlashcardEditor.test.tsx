import { render, screen, fireEvent } from "@testing-library/react";
import FlashcardEditor from "./FlashcardEditor";
import { updateDoc } from "firebase/firestore";
import { act } from "react-dom/test-utils";

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal();
  const mockUpdateDoc = vi.fn();

  return {
    ...(actual || {}),
    updateDoc: mockUpdateDoc,
  };
});

test("Renders FlashcardEditor and handles edit mode correctly", async () => {
  const mockOnSave = vi.fn();

  const cardData = { id: "1", front: "Front of card", back: "Back of card" };
  render(
    <FlashcardEditor card={cardData} learningSetId="1" onSave={mockOnSave} />
  );

  // Check that the card data is rendered
  expect(screen.getByText("Front of card")).toBeInTheDocument();
  expect(screen.getByText("Back of card")).toBeInTheDocument();

  // Simulate clicking on the Edit button
  fireEvent.click(screen.getByText("Edit"));

  // Check that the text fields for editing the card are displayed
  expect(screen.getByLabelText("Front of the card")).toBeInTheDocument();
  expect(screen.getByLabelText("Back of the card")).toBeInTheDocument();

  // Simulate clicking on the save button, adding the flashcard
  await act(async () => {
    fireEvent.click(screen.getByText("Save"));
  });
  expect(updateDoc).toHaveBeenCalled();
});
