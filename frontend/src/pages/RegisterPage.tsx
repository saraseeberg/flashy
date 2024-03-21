import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import TextField from '@mui/material/TextField';
import { Box, Button, CircularProgress } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';

function RegisterPage() {
  const [registering, setRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const username = formData.get('username') as string;

    // Sjekk at alle felt er fylt ut
    if (
      !email ||
      !password ||
      !confirm ||
      !firstName ||
      !lastName ||
      !username
    ) {
      setError('All fields are required');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setRegistering(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Brukerens ID fra autentiseringen brukes som dokument-ID i Firestore
      const userDocRef = doc(db, 'usersData', userCredential.user.uid);

      // Lagre den tilleggende informasjonen i Firestore under usersData samlingen
      await setDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: 'user',
        likedSets: [],
      });

      console.log('User registered successfully:', userCredential.user);
      navigate('/login');
    } catch (error) {
      const e = error as AuthError;
      console.error('Registration failed:', e.message);
      setError(e.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <h2>Register Account</h2>
      <Box
        component="form"
        data-testid="register-form"
        noValidate
        autoComplete="off"
        onSubmit={handleRegister}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '400px',
          width: '100%',
          '& .MuiTextField-root': { mb: 2 },
        }}
      >
        <TextField
          label="First Name"
          data-testid="firstName-input"
          variant="outlined"
          name="firstName"
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          data-testid="lastName-input"
          variant="outlined"
          name="lastName"
          fullWidth
          required
        />
        <TextField
          label="Username"
          data-testid="username-input"
          variant="outlined"
          name="username"
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          data-testid="email-input"
          name="email"
          fullWidth
          required
        />
        <TextField
          label="Password"
          data-testid="password-input"
          type="password"
          name="password"
          fullWidth
          required
        />
        <TextField
          label="Confirm Password"
          data-testid="confirm-input"
          type="password"
          name="confirm"
          fullWidth
          required
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/login')}
          >
            Back
          </Button>
          <Button
            data-testid="register-button"
            variant="contained"
            color="primary"
            type="submit"
            disabled={registering}
          >
            {registering ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </Box>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Box>
    </Box>
  );
}

export default RegisterPage;
