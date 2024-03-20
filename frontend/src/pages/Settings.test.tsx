import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from './SettingsPage';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseFirestore from 'firebase/firestore';
import { act } from 'react-dom/test-utils';

vi.mock('firebase/auth');
vi.mock('firebase/firestore');
vi.mock('../config/firebase', () => ({
  auth: { currentUser: { uid: 'testUID', email: 'test@example.com' } },
  db: {},
}));

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.alert = vi.fn();

    const mockDocRef = { id: 'testUID', path: 'usersData/testUID' };
    vi.mocked(firebaseFirestore.doc).mockReturnValue(
      mockDocRef as unknown as firebaseFirestore.DocumentReference
    );
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ username: 'testUser', firstName: 'Test' }),
    } as unknown as firebaseFirestore.DocumentSnapshot);
  });

  it('viser brukerinfo og tillater redigering av brukernavn', async () => {
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ username: 'testUser', firstName: 'Test' }),
    } as unknown as firebaseFirestore.DocumentSnapshot);

    render(<SettingsPage />);

    expect(await screen.findByText('Hello Test!')).toBeInTheDocument();

    const editButton = screen.getAllByRole('button')[0];
    fireEvent.click(editButton);

    const mockDocRef = { id: 'testUID', path: 'usersData/testUID' };
    const usernameInput = screen.getByDisplayValue('testUser');
    fireEvent.change(usernameInput, { target: { value: 'updatedUser' } });

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await act(async () => {
      expect(firebaseFirestore.updateDoc).toHaveBeenCalledWith(mockDocRef, {
        username: 'updatedUser',
      });
    });
  });

  it('sender passord reset email når brukeren ber om det', async () => {
    vi.mocked(firebaseAuth.sendPasswordResetEmail).mockResolvedValue(undefined);

    render(<SettingsPage />);

    await act(async () => {
      fireEvent.click(screen.getByText('Reset Password'));
    });

    expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com'
    );
  });

  it('sletter brukerens konto når de bekrefter sletting', async () => {
    vi.mocked(firebaseAuth.deleteUser).mockResolvedValue(undefined);
    vi.mocked(firebaseFirestore.deleteDoc).mockResolvedValue(undefined);
    window.confirm = vi.fn().mockReturnValue(true);

    render(<SettingsPage />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'delete account' }));
    });

    expect(firebaseAuth.deleteUser).toHaveBeenCalledWith(expect.anything());
    expect(firebaseFirestore.deleteDoc).toHaveBeenCalledWith(expect.anything());
  });
});
