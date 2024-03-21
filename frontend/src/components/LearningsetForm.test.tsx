import { fireEvent, render, screen } from '@testing-library/react';
import LearningsetForm from './LearningsetForm';
import { setDoc } from 'firebase/firestore';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal();
  const mockSetDoc = vi.fn();

  return {
    ...(actual || {}),
    setDoc: mockSetDoc,
  };
});

test('renders LearningsetForm and handles form submission correctly', async () => {
  render(<LearningsetForm />);

  fireEvent.change(screen.getByPlaceholderText('Title'), {
    target: { value: 'Test Title' },
  });
  fireEvent.change(screen.getByPlaceholderText('Description'), {
    target: { value: 'Test Description' },
  });

  fireEvent.click(screen.getByText('Create Learningset'));
  expect(setDoc).toHaveBeenCalled();
});
