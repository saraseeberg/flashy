import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import TextField from "@mui/material/TextField"; // Import TextField from Material-UI

const RegisterPage: React.FunctionComponent = () => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleRegister = () => {
    if (password === confirm) {
      setRegistering(true);

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User registered successfully:", user);
          navigate("/login");
        })
        .catch((error: AuthError) => {
          console.error("Registration failed:", error.message);
          setError(error.message);
        })
        .finally(() => {
          setRegistering(false);
        });
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <div>
      <h2>Register Account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            style={{ marginBottom: "10px" }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
        </div>

        <button
          onClick={() => navigate("/Login")}
          style={{ marginBottom: "1em", backgroundColor: "#EE6B6E" }}
        >
          Back
        </button>

        <button
          type="submit"
          disabled={registering}
          style={{ marginLeft: "1em", backgroundColor: "#6C9A80" }}
        >
          {registering ? "Registering..." : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
