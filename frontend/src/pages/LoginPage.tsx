import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import loginLogo from '../assets/bilde-Flashy.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [error, setError] = useState<string>();

  const { login } = useAuth();
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

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setError(undefined);
      await signInWithEmailAndPassword(auth, email, password);
      login();
      navigate('/dashboard');
      console.log('Logged in successfully');
    } catch (error) {
      setError((error as AuthError).message);
    }
  };

  /**
   * Method to handle the "New Account" button click.
   * Routes to the registration page.
   */
  const handleNewAccountClick = () => {
    navigate('/register');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mt: 16,
          gap: 10,
        }}
      >
        <img
          src={loginLogo}
          alt="logo"
          style={{
            maxWidth: '50%',
            marginBottom: '1em',
            border: '5px solid #9F70FD',
            borderRadius: '10px',
          }}
        />
        <Box>
          <Typography
            component="h1"
            variant="h6"
            fontWeight={'bold'}
            style={{ textAlign: 'center', marginBottom: '2em' }}
          >
            Flash your way to academic success!
          </Typography>
          <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              style={{ marginBottom: '1em' }}
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
              style={{ marginBottom: '2em' }}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
              Log In
            </Button>
            {error && (
              <Typography
                variant="body2"
                style={{ color: 'red', textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={handleNewAccountClick}
            >
              Register account
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
}
