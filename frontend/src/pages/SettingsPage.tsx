import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'usersData', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().username || '');
          setFirstName(userDocSnap.data().firstName || '');
        } else {
          console.log('No user document found!');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'usersData', auth.currentUser.uid);

        // Oppdaterer brukernavn i Firestore
        await updateDoc(userDocRef, {
          username: username,
        });

        alert('Changes saved successfully!');
        setEditMode(false); // Slår av redigeringsmodus
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleSendPasswordResetEmail = async () => {
    if (auth.currentUser && auth.currentUser.email) {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser.email);
        alert('A password reset link has been sent to your email.');
      } catch (error) {
        console.error('Error sending password reset email:', error);
        alert('Failed to send password reset email. Please try again.');
      }
    } else {
      alert('No email address available.');
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'usersData', auth.currentUser.uid);
          await deleteUser(auth.currentUser);
          await deleteDoc(userDocRef);
          alert('Account deleted successfully.');
          navigate('/login');
        } catch (error) {
          if (
            (error as { code: string }).code === 'auth/requires-recent-login'
          ) {
            alert('Please sign in again to delete your account.');
            // om vi får opp denne feilen, så må vi re-autentisere brukeren
          } else {
            console.error('Error deleting user account:', error);
            alert('Failed to delete account. Please try again.');
          }
        }
      } else {
        console.error('No user is currently signed in.');
        alert('No user is currently signed in.');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '10em',
        marginRight: '10em',
      }}
    >
      <h1>Settings</h1>
      <p>Hello {firstName}!</p>
      <h3>Manage Account:</h3>
      <div style={{ marginBottom: '1em' }}>
        <label>Username: </label>
        {editMode ? (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <span>{username}</span>
        )}
        <IconButton onClick={() => setEditMode(!editMode)}>
          <EditIcon />
        </IconButton>
      </div>
      {!editMode && (
        <>
          <button
            style={{
              marginLeft: '20em',
              marginRight: '20em',
              backgroundColor: '#7F27FF',
              color: 'white',
            }}
            onClick={handleSendPasswordResetEmail}
          >
            Reset Password
          </button>
          <IconButton
            style={{ margin: '1em' }}
            onClick={handleDeleteAccount}
            aria-label="delete account"
          >
            <DeleteIcon />
          </IconButton>
          <button
            style={{
              marginLeft: '20em',
              marginRight: '20em',
              backgroundColor: '#9F70FD',
              color: 'white',
            }}
            onClick={() => navigate('/dashboard')}
          >
            Back
          </button>
        </>
      )}
      {editMode && (
        <button
          style={{
            marginLeft: '20em',
            marginRight: '20em',
            backgroundColor: '#9F70FD',
            color: 'white',
          }}
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default SettingsPage;
