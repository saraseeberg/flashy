import { fireEvent, render, screen } from '@testing-library/react';
import ErrorPopup from './ErrorPopup';

test('Renders ErrorPopup and handles button clicks correctly', async () => {
  const mockOnClose = vi.fn();
  const mockNavigate = vi.fn();

  vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
  }));

  render(<ErrorPopup open={true} onClose={mockOnClose} />);

  fireEvent.click(screen.getByText('Go back'));

  expect(mockOnClose).toHaveBeenCalled();

  expect(mockNavigate).toHaveBeenCalledWith;
});
