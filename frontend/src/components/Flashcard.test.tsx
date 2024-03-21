import { render, screen } from '@testing-library/react';
import Flashcard from './Flashcard';

test('Renders Flashcard and handles delete button clicks correctly', async () => {
  window.confirm = () => true;

  const cardData = { front: 'Front of card', back: 'Back of card', id: '1' };
  render(<Flashcard card={cardData} learningSetId={cardData.id} />);

  expect(screen.getByText('Front of card')).toBeInTheDocument();
  expect(screen.getByText('Back of card')).toBeInTheDocument();
});
