import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentsSection from './CommentsSection';

describe('CommentsSection', () => {
  it('renders existing comments', async () => {
    const existingComments = ['First comment', 'Second comment'];
    render(
      <CommentsSection
        existingComments={existingComments}
        addComment={() => {}}
      />
    );

    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
  });

  it('updates input field as user types', async () => {
    const user = userEvent.setup();
    render(<CommentsSection existingComments={[]} addComment={() => {}} />);

    const inputElement = screen.getByPlaceholderText('Leave a comment...');
    await user.type(inputElement, 'New comment');

    expect(inputElement).toHaveValue('New comment');
  });

  it('calls addComment with new comment when submitted', async () => {
    const user = userEvent.setup();
    const mockAddComment = vi.fn();
    render(
      <CommentsSection existingComments={[]} addComment={mockAddComment} />
    );

    const inputElement = screen.getByPlaceholderText('Leave a comment...');
    await user.type(inputElement, 'New comment');

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    expect(mockAddComment).toHaveBeenCalledWith('New comment');
    expect(inputElement).toHaveValue('');
  });
});
