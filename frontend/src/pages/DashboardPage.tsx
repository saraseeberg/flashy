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
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { LearningSet } from "../models/Learningset";
import { ModeCommentOutlined, ThumbUp, ThumbUpOutlined } from "@mui/icons-material";

export default function Dashboard() {
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [favoritedSets, setFavoritedSets] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const [likedSets, setLikedSets] = useState<string[]>([]);
  const [filter, setFilter] = useState<"public" | "private" | "favorites">(
    "public"
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

  const updateNumberOfLikes = (setId: string, change: number) => {
    setLearningSets((prevSets) =>
      prevSets.map((set) =>
        set.id === setId ? { ...set, numberOfLikes: set.numberOfLikes + change } : set
      )
    );
  };

  const clickLikeButton = async (id: string) => {
    if (likedSets.includes(id)) {
      let updatedLikedSets = likedSets.filter((likedId) => likedId !== id);
      setLikedSets(updatedLikedSets);
      await updateSetsInFirestore(id, false);
      updateNumberOfLikes(id, -1);
    } else {
      let updatedLikedSets = [...likedSets, id];
      setLikedSets(updatedLikedSets);
      await updateSetsInFirestore(id,true);
      updateNumberOfLikes(id, 1);
    } 
  };

  const updateSetsInFirestore = async (setId: string, isLiked: boolean) => {
    if (currentUserId) {
      const userDocRef = doc(db, "usersData", currentUserId);
      await updateDoc(userDocRef, {
        likedSets: isLiked ? arrayUnion(setId) : arrayRemove(setId),
      });
    }
  
    const setDocRef = doc(db, "learningSets", setId);
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

          default:
            return true;
        }
      });

      if (mounted) {
        setLearningSets(filteredLearningSets);
      }

      const filterBySearch = filteredLearningSets.filter((learningSet) => {
        return learningSet.title
          .toLowerCase()
          .includes(query.toLowerCase() || "");
      });
      if (query !== "") {
        setLearningSets(filterBySearch);
      }
    };

    fetchFavoritesAndSets();

    return () => {
      mounted = false;

      const fetchLikedSets = async () => {
        if (currentUserId) {
          const userDocRef = doc(db, "usersData", currentUserId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData && userData.likedSets) {
              setLikedSets(userData.likedSets);
            }
          }
        }
        const setsDocRef = collection(db, "learningSets");
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
          const likes = likesData.find((item) => item.id === set.id)?.likes || 0;
          return { ...set, numberOfLikes: likes };
        });
        setLearningSets(updatedSets);

      };
      fetchLikedSets();
    };
  }, [currentUserId, filter, query]);

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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton sx={{ marginTop: "auto" }} onClick={(event) => 
                    {event.stopPropagation();
                    learningSet.id && clickLikeButton(learningSet.id)}}>

                    {likedSets.includes(learningSet.id ?? "") ? (
                      <ThumbUp sx={{ color: "blue" }} /> 
                    ) : (
                    <ThumbUpOutlined />
                    )}
                  </IconButton>
                  <Typography variant="body2" sx={{ marginTop: "40px", marginRight: "10px" }}>
                    {learningSet.numberOfLikes}
                  </Typography>
                  </Box>
                  <IconButton sx={{ marginTop: "auto" }} onClick={() => {}}>
                    <ModeCommentOutlined />
                  </IconButton>
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
        <MenuItem onClick={handleDeleteSet} sx={{ color: "red" }}>
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
}
