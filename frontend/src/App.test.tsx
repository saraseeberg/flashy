import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from './AppRouter';

vi.mock('./hooks/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});

describe('App routing', () => {
  it('should render the login page when not authenticated', async () => {
    render(<AppRouter />);
    expect(await screen.findByText(/Log in/i)).toBeInTheDocument();
  });
});
