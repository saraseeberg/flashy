import { render, screen, fireEvent } from '@testing-library/react';
import FlashcardForm from './FlashcardForm';
import { addDoc } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  const mockSetDoc = vi.fn();

  return {
    ...(actual || {}),
    addDoc: mockSetDoc,
  };
});

test('Renders FlashcardForm and handles form submission correctly', async () => {
  const mockOnSave = vi.fn();

  render(<FlashcardForm learningSetId="1" onSave={mockOnSave} />);

  fireEvent.change(screen.getByLabelText('Front of the card'), {
    target: { value: 'Front of card' },
  });
  fireEvent.change(screen.getByLabelText('Back of the card'), {
    target: { value: 'Back of card' },
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Add'));
  });
  expect(addDoc).toHaveBeenCalled();
});
