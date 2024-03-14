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
        category: "none",
      },
      {
        id: "2",
        title: "Private Set",
        description: "A private learning set",
        isPublic: false,
        createdBy: "testUID",
        category: "none",
      },
      {
        id: "3",
        title: "Others Public Set",
        description: "Another public set",
        isPublic: true,
        createdBy: "otherUID",
        category: "none",
      },
    ];

    vi.mocked(firebaseFirestore.getDocs).mockResolvedValue({
      docs: learningSets.map((set) => ({
        id: set.id,
        data: () => set,
        exists: () => true,
      })),
    } as unknown as firebaseFirestore.QuerySnapshot<firebaseFirestore.DocumentData>);

    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ favoritedSets: [] }),
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

  test("shows only favorited sets when 'favorites' is selected", async () => {
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ favoritedSets: ["1"] }),
    } as unknown as firebaseFirestore.DocumentSnapshot<firebaseFirestore.DocumentData>);

    render(<Dashboard />);

    await waitFor(() =>
      expect(screen.getByText("Public Set")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByLabelText("favorites"));
    await waitFor(() => {
      expect(screen.getByText("Public Set")).toBeInTheDocument();
    });
    expect(screen.queryByText("Private Set")).not.toBeInTheDocument();
    expect(screen.queryByText("Others Public Set")).not.toBeInTheDocument();
  });
});
