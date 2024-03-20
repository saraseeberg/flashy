import {
  Box,
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { LearningSet } from '../models/Learningset';
import { useEffect, useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserData } from '../models/UserData';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showUsers, setShowUsers] = useState(true);
  const navigate = useNavigate();

  const handleShowSwitch = () => {
    setShowUsers(!showUsers);
  };

  //LEARNING SETS
  useEffect(() => {
    const fetchLearningSets = async () => {
      const docCollectionRef = collection(db as Firestore, 'learningSets');
      const querySnapshot = await getDocs(docCollectionRef);
      const fetchedLearningSets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LearningSet, 'id'>),
      }));
      setLearningSets(fetchedLearningSets);
    };

    fetchLearningSets();
  }, []);

  //Delete learning set
  const handleDelete = () => {
    if (selectedId && showUsers) {
      const docRef = doc(db, 'usersData', selectedId);
      deleteDoc(docRef)
        .then(() => {
          console.log('Document successfully deleted!');
          setUsers(users.filter((user) => user.id !== selectedId));
        })
        .catch((error) => {
          console.error('Error removing user: ', error);
        });
    } else if (selectedId && !showUsers) {
      const docRef = doc(db, 'learningSets', selectedId);
      deleteDoc(docRef)
        .then(() => {
          console.log('Document successfully deleted!');
          setLearningSets(learningSets.filter((set) => set.id !== selectedId));
        })
        .catch((error) => {
          console.error('Error removing learningset: ', error);
        });
    } else {
      console.error('No object selected for deletion');
    }
    handleClose();
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  //USERS
  useEffect(() => {
    const fetchUsers = async () => {
      const docCollectionRef = collection(db as Firestore, 'usersData');
      const querySnapshot = await getDocs(docCollectionRef);
      const fetchedUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserData, 'id'>),
      }));
      const filteredUsers = fetchedUsers.filter(
        (user) => user.role != 'superadmin'
      );
      setUsers(filteredUsers);
    };

    fetchUsers();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          minHeight: '50px',
        }}
      >
        <Typography variant="h4" fontWeight="bold" component="h1">
          {showUsers ? 'Users' : 'Learning sets'}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<GroupAddIcon />}
          onClick={() => navigate('/create-adminUser')}
        >
          Register admin account
        </Button>
        <ToggleButtonGroup
          value={showUsers ? 'users' : 'learningset'}
          color="primary"
          exclusive
          onChange={handleShowSwitch}
          aria-label="contentDisplayed"
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        >
          <ToggleButton value="users" aria-label="users">
            Users
          </ToggleButton>
          <ToggleButton value="learningset" aria-label="learningsets">
            Learning sets
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
        <Grid container spacing={2}>
          {showUsers
            ? users.map((user) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={user.id}
                  sx={{ mb: '20px' }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minHeight: 200,
                      padding: 2,
                      borderRadius: 2,
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0px 6px 15px rgba(0,0,0,0.1)',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        minHeight: '30px',
                      }}
                    >
                      <Box>
                        <Button
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleMenuClick(e, user.id || '')}
                          sx={{
                            '&:focus': { outline: 'none' },
                            '&:hover': { backgroundColor: '#grey' },
                          }}
                        >
                          <MoreHorizIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={'bold'}
                      sx={{ paddingBottom: '20px' }}
                    >
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.firstName + ' ' + user.lastName}
                    </Typography>
                  </Paper>
                </Grid>
              ))
            : learningSets.map((learningSet) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={learningSet.id}
                  sx={{ mb: '20px' }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minHeight: 200,
                      padding: 2,
                      borderRadius: 2,
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0px 6px 15px rgba(0,0,0,0.1)',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                        minHeight: '30px',
                      }}
                    >
                      <Box>
                        <Button
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={(e) =>
                            handleMenuClick(e, learningSet.id || '')
                          }
                          sx={{
                            '&:focus': { outline: 'none' },
                            '&:hover': { backgroundColor: '#grey' },
                          }}
                        >
                          <MoreHorizIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={'bold'}
                      sx={{ paddingBottom: '20px' }}
                    >
                      {learningSet.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {learningSet.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
        </Grid>
      </Box>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'red' }}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}
