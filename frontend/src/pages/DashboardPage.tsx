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
} from "@mui/material";
import { IconButton } from "@mui/material";
<<<<<<< frontend/src/pages/DashboardPage.tsx
import Modal from '@mui/material/Modal';
import Checkbox from "@mui/material/Checkbox";
import { styled } from '@mui/material/styles';
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from '@mui/material/FormGroup';
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  Firestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { LearningSet } from "../models/Learningset";



  const categories = ['geography', 'History','Annet' ];
  
  const StyleModal = styled(Modal)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
    const ModalBox = styled(Box)(({ theme }) => ({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4),
      outline: 'none',
    }));

export default function Dashboard() {
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [favoritedSets, setFavoritedSets] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const initialCategories = { geography: false, history: false, annet: false };
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: boolean }>(initialCategories);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"public" | "private" | "favorites">(
    "public"
  );



  const toggleFavorite = (id: string) => {
=======
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
  setSelectedCategories(prev => ({ ...prev, [name.toLowerCase()]: checked }));
  };  

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
=======
  const updateFavoritesInFirestore = async (updatedFavorites: string[]) => {
    if (currentUserId) {
      const userDocRef = doc(db, "usersData", currentUserId);
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
      const docRef = doc(db, "learningSets", selectedSetId);
      deleteDoc(docRef)
        .then(() => {
          console.log("Document successfully deleted!");
          setLearningSets(
            learningSets.filter((set) => set.id !== selectedSetId)
          );
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    } else {
      console.error("No set selected for deletion");
    }
    handleClose();
  };

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: "public" | "private" | "favorites"
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchFavoritesAndSets = async () => {
      let userFavoritedSets: string[] = [];
      if (currentUserId) {
        const userDocRef = doc(db, "usersData", currentUserId);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && mounted) {
          const userData = docSnap.data();
          userFavoritedSets = userData.favoritedSets || [];
          setFavoritedSets(userFavoritedSets);
        }
      }

      const docCollectionRef = collection(db as Firestore, "learningSets");
      const querySnapshot = await getDocs(docCollectionRef);
      const fetchedLearningSets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LearningSet, "id">),
      }));

      const filteredLearningSets = fetchedLearningSets.filter((learningSet) => {
        const isFavorited = userFavoritedSets.includes(learningSet.id ?? "");
        switch (filter) {
          case "favorites":
            return isFavorited;
          case "public":
            return learningSet.isPublic;
          case "private":
            return (
              !learningSet.isPublic && learningSet.createdBy === currentUserId
            );


      if (Object.values(selectedCategories).some((val) => val)) {
        filterlearningset = filterlearningset.filter((learningSet) =>
          selectedCategories[learningSet.category]
        );
      }

      if (showFavorites) {
        filterlearningset = filterlearningset.filter((learningSet) =>
          favoritedSets.includes(learningSet.id ?? "")
        );
=======
          default:
            return true;
        }
      });

      if (mounted) {
        setLearningSets(filteredLearningSets);
      }

      return () => {
      mounted = false;
    };

    fetchFavoritesAndSets();

      const filterBySearch = filteredLearningSets.filter((learningSet) => {
        return learningSet.title
          .toLowerCase()
          .includes(query.toLowerCase() || "");
      });
      if (query !== "") {
        setLearningSets(filterBySearch);
      }
    };
    fetchLearningSets();
  }, [currentUserId, showPublic,selectedCategories, filter, showFavorites, favoritedSets, query]);
=======

    

    
  

  return (
    <Container maxWidth="lg" sx={{ marginTop: "20px", marginBottom: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          minHeight: "50px",
        }}
      >
        <Typography variant="h4" fontWeight="bold" component="h1">
          Learning sets
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate("/create-set")}
        >
          Create new learning set
        </Button>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="learning set filter"
          sx={{ bgcolor: "white", borderRadius: 1 }}
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
<<<<<<< frontend/src/pages/DashboardPage.tsx
        <Button onClick={handleOpenFilterModal} sx={{ marginLeft: 2 }}>
          Filter
        </Button>      
        <Modal
            open={filterModalOpen}
            onClose={handleCloseFilterModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
        <Box sx={{position: 'absolute', 
                top: '50%',
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                p: 4}}>
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
        <Button
          variant={showFavorites ? "contained" : "outlined"}
          onClick={handleShowFavorites}
          sx={{ marginLeft: 2 }}
        >
          Favorites
        </Button>
=======
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
              sx={{ mb: "20px" }}
            >
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: 200,
                  padding: 2,
                  borderRadius: 2,
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
                  },
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/viewcards/${learningSet.id}`)}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    minHeight: "30px",
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
                      {favoritedSets.includes(learningSet.id ?? "") ? (
                        <FavoriteIcon sx={{ color: "yellow" }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>
                  <Box>
                    {learningSet.createdBy == currentUserId ? (
                      <Button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(e) =>
                          handleMenuClick(e, learningSet.id || "")
                        }
                        sx={{
                          "&:focus": { outline: "none" },
                          "&:hover": { backgroundColor: "#grey" },
                        }}
                      >
                        <MoreHorizIcon />
                      </Button>
                    ) : null}
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={"bold"}
                  sx={{ paddingBottom: "20px" }}
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
        <MenuItem onClick={handleEditSet}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteSet} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}
