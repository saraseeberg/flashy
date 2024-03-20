import { render, screen } from '@testing-library/react';
import NotFound from './NotFoundPage';

describe('NotFound Page', () => {
  it("displays the 'Page not found' and additional guidance correctly", () => {
    render(<NotFound />);

    expect(screen.getByText('Page not found')).toBeInTheDocument();

    expect(
      screen.getByText(
        'The path you have specified does not exist. Please press on the app-logo to return back to the main-page or specify a valid path.'
      )
    ).toBeInTheDocument();
  });
});
