import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, db } from '../config/firebase';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import {
  Box,
  Grid,
  Button,
  Typography,
  Paper,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  Modal,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  ModeCommentOutlined,
  ThumbUp,
  ThumbUpOutlined,
  AddCircleOutline,
  MoreHoriz,
  FavoriteBorder,
  Favorite,
} from '@mui/icons-material';

import { LearningSet } from '../models/Learningset';

export default function Dashboard() {
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [favoritedSets, setFavoritedSets] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const initialCategories = {
    geography: false,
    history: false,
    programming: false,
    none: false,
  };
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: boolean;
  }>(initialCategories);
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();
  const [likedSets, setLikedSets] = useState<string[]>([]);
  const [filter, setFilter] = useState<'public' | 'private' | 'favorites'>(
    'public'
  );

  const toggleFavorite = async (id: string) => {
    let updatedFavorites = [...favoritedSets];
    if (favoritedSets.includes(id)) {
      updatedFavorites = updatedFavorites.filter((favId) => favId !== id);
    } else {
      updatedFavorites.push(id);
    }
    setFavoritedSets(updatedFavorites);
    await updateFavoritesInFirestore(updatedFavorites);
  };

  const handleOpenFilterModal = () => setFilterModalOpen(true);
  const handleCloseFilterModal = () => setFilterModalOpen(false);
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedCategories((prev) => ({
      ...prev,
      [name.toLowerCase()]: checked,
    }));
  };

  const updateFavoritesInFirestore = async (updatedFavorites: string[]) => {
    if (currentUserId) {
      const userDocRef = doc(db, 'usersData', currentUserId);
      await updateDoc(userDocRef, {
        favoritedSets: updatedFavorites,
      });
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSetId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedSetId(null);
  };

  const handleEditSet = () => {
    if (selectedSetId) {
      navigate(`/edit-set/${selectedSetId}`);
      handleClose();
    }
  };

  const handleDeleteSet = () => {
    if (selectedSetId) {
      const docRef = doc(db, 'learningSets', selectedSetId);
      deleteDoc(docRef)
        .then(() => {
          console.log('Document successfully deleted!');
          setLearningSets(
            learningSets.filter((set) => set.id !== selectedSetId)
          );
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
    } else {
      console.error('No set selected for deletion');
    }
    handleClose();
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: 'public' | 'private' | 'favorites'
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const updateNumberOfLikes = (setId: string, change: number) => {
    setLearningSets((prevSets) =>
      prevSets.map((set) =>
        set.id === setId
          ? { ...set, numberOfLikes: set.numberOfLikes + change }
          : set
      )
    );
  };

  const clickLikeButton = async (id: string) => {
    if (likedSets.includes(id)) {
      const updatedLikedSets = likedSets.filter((likedId) => likedId !== id);
      setLikedSets(updatedLikedSets);
      await updateSetsInFirestore(id, false);
      updateNumberOfLikes(id, -1);
    } else {
      const updatedLikedSets = [...likedSets, id];
      setLikedSets(updatedLikedSets);
      await updateSetsInFirestore(id, true);
      updateNumberOfLikes(id, 1);
    }
  };

  const updateSetsInFirestore = async (setId: string, isLiked: boolean) => {
    if (currentUserId) {
      const userDocRef = doc(db, 'usersData', currentUserId);
      await updateDoc(userDocRef, {
        likedSets: isLiked ? arrayUnion(setId) : arrayRemove(setId),
      });
    }

    const setDocRef = doc(db, 'learningSets', setId);
    const setDocSnap = await getDoc(setDocRef);
    if (setDocSnap.exists()) {
      const data = setDocSnap.data();
      if (data) {
        let likes = data.numberOfLikes;
        if (isLiked) {
          likes += 1;
        } else {
          likes -= 1;
        }
        await setDoc(setDocRef, { numberOfLikes: likes }, { merge: true });
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchFavoritesAndSets = async () => {
      let userFavoritedSets: string[] = [];
      if (currentUserId) {
        const userDocRef = doc(db, 'usersData', currentUserId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && mounted) {
          const userData = docSnap.data();
          userFavoritedSets = userData.favoritedSets || [];
          setFavoritedSets(userFavoritedSets);
        }
      }

      const docCollectionRef = collection(db as Firestore, 'learningSets');
      const querySnapshot = await getDocs(docCollectionRef);
      const fetchedLearningSets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LearningSet, 'id'>),
      }));

      let filteredLearningSets = fetchedLearningSets.filter((learningSet) => {
        const isFavorited = userFavoritedSets.includes(learningSet.id ?? '');
        switch (filter) {
          case 'favorites':
            return isFavorited;
          case 'public':
            return learningSet.isPublic;
          case 'private':
            return (
              !learningSet.isPublic && learningSet.createdBy === currentUserId
            );
          default:
            return true;
        }
      });

      if (Object.values(selectedCategories).some((val) => val)) {
        filteredLearningSets = filteredLearningSets.filter(
          (learningSet) =>
            selectedCategories[learningSet.category.toLowerCase()]
        );
      }
      if (mounted) {
        setLearningSets(filteredLearningSets);
      }

      const filterBySearch = filteredLearningSets.filter((learningSet) => {
        return learningSet.title
          .toLowerCase()
          .includes(query.toLowerCase() || '');
      });

      if (query !== '') {
        setLearningSets(filterBySearch);
      }
    };
    fetchFavoritesAndSets();

    return () => {
      mounted = false;

      const fetchLikedSets = async () => {
        if (currentUserId) {
          const userDocRef = doc(db, 'usersData', currentUserId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData && userData.likedSets) {
              setLikedSets(userData.likedSets);
            }
          }
        }
        const setsDocRef = collection(db, 'learningSets');
        const setsDocSnap = await getDocs(setsDocRef);
        const likesPromises = setsDocSnap.docs.map(async (doc) => {
          const data = doc.data();
          if (data) {
            return { id: doc.id, likes: data.numberOfLikes };
          }
          return { id: doc.id, likes: 0 };
        });

        const likesData = await Promise.all(likesPromises);
        const updatedSets = learningSets.map((set) => {
          const likes =
            likesData.find((item) => item.id === set.id)?.likes || 0;
          return { ...set, numberOfLikes: likes };
        });
        setLearningSets(updatedSets);
      };
      fetchLikedSets();
    };
  }, [currentUserId, filter, selectedCategories, query]);

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
          Learning sets
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() => navigate('/create-set')}
        >
          Create new learning set
        </Button>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="learning set filter"
          sx={{ bgcolor: 'white', borderRadius: 1 }}
        >
          <ToggleButton value="public" aria-label="public">
            Public
          </ToggleButton>
          <ToggleButton value="private" aria-label="private">
            Private
          </ToggleButton>
          <ToggleButton value="favorites" aria-label="favorites">
            Favorites
          </ToggleButton>
        </ToggleButtonGroup>
        <Button onClick={handleOpenFilterModal} sx={{ marginLeft: 2 }}>
          Filter
        </Button>
        <Modal
          open={filterModalOpen}
          onClose={handleCloseFilterModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Filter by Category
            </Typography>
            <FormGroup>
              {Object.keys(selectedCategories).map((category) => {
                const key = category as keyof typeof selectedCategories;
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedCategories[key]}
                        onChange={handleCategoryChange}
                        name={category}
                      />
                    }
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                    key={category}
                  />
                );
              })}
            </FormGroup>
          </Box>
        </Modal>
        <TextField
          type="text"
          label="Search"
          placeholder="Search for flashcards"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>
      <Box>
        <Grid container spacing={2}>
          {learningSets.map((learningSet) => (
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
                onClick={() => navigate(`/viewcards/${learningSet.id}`)}
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
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (learningSet.id) {
                          toggleFavorite(learningSet.id);
                        }
                      }}
                    >
                      {favoritedSets.includes(learningSet.id ?? '') ? (
                        <Favorite sx={{ color: '#FFBF1F' }} />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>
                  </Box>
                  <Box>
                    {learningSet.createdBy == currentUserId ? (
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
                        <MoreHoriz />
                      </Button>
                    ) : null}
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '50%',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        learningSet.id && clickLikeButton(learningSet.id);
                      }}
                    >
                      {likedSets.includes(learningSet.id ?? '') ? (
                        <ThumbUp sx={{ color: 'blue' }} />
                      ) : (
                        <ThumbUpOutlined />
                      )}
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ paddingLeft: '5%' }}
                    >
                      {learningSet.numberOfLikes}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <ModeCommentOutlined />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ paddingLeft: '5%' }}
                    >
                      {learningSet.comments?.length || 0}
                    </Typography>
                  </Box>
                </Box>
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
        <MenuItem onClick={handleEditSet}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteSet} sx={{ color: 'red' }}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}
