import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './LoginPage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserCredential } from 'firebase/auth';

vi.mock('../config/firebase', () => ({
  auth: {},
}));

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('allows a user to log in if credentials are correct', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: {
        uid: 'some-uid',
        email: 'user@example.com',
      },
    } as UserCredential);

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'user@example.com',
      'password'
    );
  });

  it('shows an error if login fails', async () => {
    const errorMessage = 'User does not exist';
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
      message: errorMessage,
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
