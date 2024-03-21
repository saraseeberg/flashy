import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

test('Renders card as unflipped and checks that front of the card is displayed', async () => {
  const mockOnDifficultyChange = vi.fn();

  const cardData = {
    id: '1',
    front: 'Front of card',
    back: 'Back of card',
    isDifficult: false,
    isFlipped: false,
  };
  render(<Card {...cardData} onDifficultyChange={mockOnDifficultyChange} />);
  expect(screen.getByText('Front of card')).toBeInTheDocument();
  expect(screen.getByText('Question')).toBeInTheDocument();
});

test('Renders card as flipped and checks that back of the card is displayed', async () => {
  const mockOnDifficultyChange = vi.fn();

  const cardData = {
    id: '1',
    front: 'Front of card',
    back: 'Back of card',
    isDifficult: false,
    isFlipped: true,
  };
  render(<Card {...cardData} onDifficultyChange={mockOnDifficultyChange} />);
  expect(screen.getByText('Back of card')).toBeInTheDocument();
  expect(screen.getByText('Answer')).toBeInTheDocument();
});

test('Renders Card and handles difficulty checkbox changes correctly', async () => {
  const mockOnDifficultyChange = vi.fn();

  const cardData = {
    id: '1',
    front: 'Front of card',
    back: 'Back of card',
    isDifficult: false,
    isFlipped: false,
  };
  render(<Card {...cardData} onDifficultyChange={mockOnDifficultyChange} />);

  fireEvent.click(screen.getByText('Difficult card?'));

  expect(mockOnDifficultyChange).toHaveBeenCalled();
});
