import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./DashboardPage";
import * as firebaseFirestore from "firebase/firestore";
import { LearningSet } from "../models/Learningset";

vi.mock("firebase/firestore");
vi.mock("firebase/auth");
vi.mock("../config/firebase", () => ({
  auth: { currentUser: { uid: "testUID" } },
  db: {},
}));

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    const learningSets: LearningSet[] = [
      {
        id: "1",
        title: "Public Set",
        description: "A public learning set",
        isPublic: true,
        createdBy: "testUID",
      },
      {
        id: "2",
        title: "Private Set",
        description: "A private learning set",
        isPublic: false,
        createdBy: "testUID",
      },
      {
        id: "3",
        title: "Others Public Set",
        description: "Another public set",
        isPublic: true,
        createdBy: "otherUID",
      },
    ];

    // Mock `getDocs` for å returnere læringssett
    vi.mocked(firebaseFirestore.getDocs).mockResolvedValue({
      docs: learningSets.map((set) => ({
        id: set.id,
        data: () => set,
        exists: () => true,
      })),
    } as unknown as firebaseFirestore.QuerySnapshot<firebaseFirestore.DocumentData>);

    // Oppdater `getDoc`-mocken for å håndtere unhandled rejection feil
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ favoritedSets: [] }), // Anta ingen favoriserte sett i starten
    } as unknown as firebaseFirestore.DocumentSnapshot<firebaseFirestore.DocumentData>);
  });

  test("shows public sets correctly when 'public' is selected", async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Public Set")).toBeInTheDocument();
      expect(screen.getByText("Others Public Set")).toBeInTheDocument();
    });
    expect(screen.queryByText("Private Set")).toBeNull();
  });

  test("shows only user's private sets when 'private' is selected", async () => {
    render(<Dashboard />);

    fireEvent.click(screen.getByLabelText("private"));
    await waitFor(() => {
      expect(screen.queryByText("Public Set")).toBeNull();
      expect(screen.queryByText("Others Public Set")).toBeNull();
      expect(screen.getByText("Private Set")).toBeInTheDocument();
    });
  });
});
