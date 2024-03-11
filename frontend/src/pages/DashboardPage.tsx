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
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
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
} from "firebase/firestore";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { LearningSet } from "../models/Learningset";

export default function Dashboard() {
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [showPublic, setShowPublic] = useState(true);
  const [favoritedSets, setFavoritedSets] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  const handlePrivacyChange = () => {
    setShowPublic(!showPublic);
  };

  const toggleFavorite = (id: string) => {
    if (favoritedSets.includes(id)) {
      setFavoritedSets(favoritedSets.filter((favId) => favId !== id));
    } else {
      setFavoritedSets([...favoritedSets, id]);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
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

  useEffect(() => {
    const fetchLearningSets = async () => {
      const docCollectionRef = collection(db as Firestore, "learningSets");
      const querySnapshot = await getDocs(docCollectionRef);
      const fetchedLearningSets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LearningSet, "id">),
      }));

      let filterlearningset = fetchedLearningSets.filter((learningSet) =>
        showPublic
          ? learningSet.isPublic
          : !learningSet.isPublic && learningSet.createdBy === currentUserId
      );

      if (showFavorites) {
        filterlearningset = filterlearningset.filter((learningSet) =>
          favoritedSets.includes(learningSet.id ?? "")
        );
      }

      if(query!==''){
        filterlearningset = filterlearningset.filter(card => card.title.toLowerCase().includes(query || ''));
      }
      setLearningSets(filterlearningset);
    };
    fetchLearningSets();
  }, [currentUserId, showPublic, showFavorites, favoritedSets, query]);

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
          Learning Sets
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate("/create-set")}
        >
          Create new learning set
        </Button>
        <ToggleButtonGroup
          value={showPublic ? "public" : "private"}
          color="primary"
          exclusive
          onChange={handlePrivacyChange}
          aria-label="privacy"
          sx={{ bgcolor: "white", borderRadius: 1 }}
        >
          <ToggleButton value="public" aria-label="public">
            Public
          </ToggleButton>
          <ToggleButton value="private" aria-label="private">
            Private
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant={showFavorites ? "contained" : "outlined"}
          onClick={handleShowFavorites}
          sx={{ marginLeft: 2 }}
        >
          Favorites
        </Button>
         <TextField
              type="text"
              label="Search"
              placeholder="Search for flashcards"
              value={query}
              onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
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
