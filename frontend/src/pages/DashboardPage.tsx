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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasFaStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farFaStar } from "@fortawesome/free-regular-svg-icons";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Firestore, collection, getDocs } from "firebase/firestore";
import { LearningSet } from "../models/Learningset";

export default function Dashboard() {
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [showPublic, setShowPublic] = useState(true);

  const navigate = useNavigate();

  const handlePrivacyChange = () => {
    setShowPublic(!showPublic);
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
    console.log("Deleting", selectedSetId);
    handleClose();
  };

  // const handleSetFavorite = (id: string) => {
  //   console.log("Favorite", id);
  // };

  useEffect(() => {
    const fetchLearningSets = async () => {
      const docCollectionRef = collection(db as Firestore, "learningSets");
      const querySnapshot = await getDocs(docCollectionRef);
      const fetchedLearningSets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LearningSet, "id">),
      }));
      const filterlearningset = fetchedLearningSets.filter((learningSet) =>
        showPublic ? learningSet.isPublic : !learningSet.isPublic
      );
      setLearningSets(filterlearningset);
    };

    fetchLearningSets();
    console.log(learningSets);
  }, [showPublic]);

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px", marginBottom: "20px" }}>
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
      </Box>
      <Box>
        <Grid container spacing={2} sx={{ overflowY: "scroll" }}>
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
                    {!learningSet.isPublic ? (
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
                  {/* <Button
                    onClick={() => handleSetFavorite(learningSet.id ?? "")}
                  >
                    {learningSet.isFavorite ? (
                      <FontAwesomeIcon icon={fasFaStar} color="gold" />
                    ) : (
                      <FontAwesomeIcon icon={farFaStar} color="black" />
                    )}
                  </Button> */}
                </Box>
                <Typography variant="h6" fontWeight={"bold"}>
                  {learningSet.title}
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
