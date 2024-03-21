import { fireEvent, render, screen } from '@testing-library/react';
import ShufflePopup from './ShufflePopup';

test('ShufflePopup renders correctly and handles events', async () => {
  const onShuffle = vi.fn();
  const onNoShuffle = vi.fn();

  render(
    <ShufflePopup
      open={true}
      onClose={vi.fn()}
      onShuffle={onShuffle}
      onNoShuffle={onNoShuffle}
    />
  );

  expect(
    screen.getByText('Do you want the cards to be shuffled?')
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText('No shuffle!'));
  expect(onNoShuffle).toHaveBeenCalled();

  fireEvent.click(screen.getByText('Shuffle!'));
  expect(onShuffle).toHaveBeenCalled();
});
