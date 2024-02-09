import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box } from "@mui/material";
import loginLogo from "../assets/bilde-Flashy.svg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /**
   * Type for the error object returned by Firebase Auth.
   */
  type AuthError = {
    code: string;
    message: string;
  };

  /**
   * Method to handle the form submission.
   * @param event
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
    } catch (error) {
      setError((error as AuthError).message);
    }
  };

  /**
   * Method to handle the "New Account" button click.
   * Routes to the registration page.
   */
  const handleNewAccountClick = () => {
    navigate("/register");
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={loginLogo} alt="logo" style={{ width: "100px" }} />
        <div className="login-components">
          <Typography
            component="h1"
            variant="h6"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            Flash your way to academic success!
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ marginTop: "20px", width: "100%" }}
            >
              <TextField
                required
                fullWidth
                id="email"
                label="Email or username"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" fullWidth variant="contained">
                Log In
              </Button>
              {error && (
                <Typography
                  variant="body2"
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    color: "red",
                    padding: "10px",
                  }}
                >
                  {error}
                </Typography>
              )}
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handleNewAccountClick}
              >
                New Account
              </Button>
            </form>
          </div>
        </div>
      </Box>
    </Container>
  );
}
