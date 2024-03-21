import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPage from './AdminPage';
import * as firebaseFirestore from 'firebase/firestore';
import { LearningSet } from '../models/Learningset';
import { UserData } from '../models/UserData';

vi.mock('firebase/firestore');
vi.mock('firebase/auth');
vi.mock('../config/firebase', () => ({
  auth: { currentUser: { uid: 'testUID' } },
  db: {},
}));

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('AdminPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const learningSets: LearningSet[] = [
      {
        id: '1',
        title: 'Public Set',
        description: 'A public learning set',
        isPublic: true,
        createdBy: 'testUID',
        comments: [],
        numberOfLikes: 0,
        category: 'None',
      },
      {
        id: '2',
        title: 'Private Set',
        description: 'A private learning set',
        isPublic: false,
        createdBy: 'testUID',
        comments: [],
        numberOfLikes: 0,
        category: 'None',
      },
    ];

    const users: UserData[] = [
      {
        id: 'testUID',
        username: 'adminuser',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        favoritedSets: [],
      },
      {
        id: 'otherUID',
        username: 'otheruser',
        firstName: 'Other',
        lastName: 'User',
        role: 'user',
        favoritedSets: [],
      },
      {
        id: 'superadminUID',
        username: 'superadminuser',
        firstName: 'Super',
        lastName: 'User',
        role: 'superadmin',
        favoritedSets: [],
      },
    ];

    vi.mocked(firebaseFirestore.getDocs).mockImplementationOnce(() =>
      Promise.resolve({
        docs: learningSets.map((set) => ({
          id: set.id,
          data: () => set,
          exists: () => true,
        })),
      } as unknown as firebaseFirestore.QuerySnapshot<firebaseFirestore.DocumentData>)
    );

    vi.mocked(firebaseFirestore.getDocs).mockImplementationOnce(() =>
      Promise.resolve({
        docs: users.map((user) => ({
          id: user.id,
          data: () => user,
          exists: () => true,
        })),
      } as unknown as firebaseFirestore.QuerySnapshot<firebaseFirestore.DocumentData>)
    );
  });

  test('fetches learning sets and users correctly', async () => {
    render(<AdminPage />);
    expect(await screen.findByText('adminuser')).toBeInTheDocument();
    expect(screen.getByText('otheruser')).toBeInTheDocument();
    expect(screen.queryByText('superadminuser')).toBeNull();
    expect(screen.queryByText('Private Set')).toBeNull();
    expect(screen.queryByText('Public Set')).toBeNull();
  });

  test('toggles between showing users and learning sets', async () => {
    render(<AdminPage />);

    fireEvent.click(screen.getByLabelText('learningsets'));
    await waitFor(() => {
      expect(screen.queryByText('superadminuser')).toBeNull();
      expect(screen.queryByText('adminuser')).toBeNull();
      expect(screen.queryByText('otheruser')).toBeNull();
      expect(screen.getByText('Public Set')).toBeInTheDocument();
      expect(screen.getByText('Private Set')).toBeInTheDocument();
    });
  });
});
