import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./LoginPage";
import { IdTokenResult, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase"; // Oppdater stien til din Firebase-konfigurasjon

// Mock hooks og funksjoner
vi.mock("../config/firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    // Resetter mocks før hver test
    vi.resetAllMocks();
  });

  it("allows a user to log in if credentials are correct", async () => {
    // Oppdaterer mocken til å returnere et mer komplett UserCredential-objekt
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: {
        uid: "some-uid",
        email: "user@example.com",
        displayName: "Test User",
        emailVerified: false,
        isAnonymous: false,
        providerData: [],
        refreshToken: "",
        tenantId: null,
        delete: function (): Promise<void> {
          throw new Error("Function not implemented.");
        },
        getIdToken: function (
          forceRefresh?: boolean | undefined
        ): Promise<string> {
          throw new Error("Function not implemented.");
        },
        getIdTokenResult: function (
          forceRefresh?: boolean | undefined
        ): Promise<IdTokenResult> {
          throw new Error("Function not implemented.");
        },
        reload: function (): Promise<void> {
          throw new Error("Function not implemented.");
        },
        toJSON: function (): object {
          throw new Error("Function not implemented.");
        },
        phoneNumber: null,
        photoURL: null,
        providerId: "",
        metadata: {},
      },
      providerId: "password",
      operationType: "signIn",
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "user@example.com",
      "password"
    );
  });

  it("shows an error if login fails", async () => {
    const errorMessage = "User does not exist";
    // Mock feilet innlogging med en spesifikk feilmelding
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
      message: errorMessage,
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    // Forventer at feilmeldingen vises på skjermen
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});
