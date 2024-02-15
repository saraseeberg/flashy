import { Box, Grid, Button, Typography, Paper, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import EditIcon from '@mui/icons-material/Edit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons';

interface LearningSet {
  id: number;
  name: string;
  isFavorite: boolean;
}

export default function Dashboard() {
  const learningSets: LearningSet[] = [
    { id: 1, name: "Set 1", isFavorite: true },
    { id: 2, name: "Set 2", isFavorite: false },
    { id: 3, name: "Set 3", isFavorite: false },
    { id: 4, name: "Set 4", isFavorite: true },
    { id: 5, name: "Set 5", isFavorite: false },
    { id: 6, name: "Set 6", isFavorite: false },
    { id: 7, name: "Set 7", isFavorite: false },
    { id: 8, name: "Set 8", isFavorite: true },
    { id: 9, name: "Set 9", isFavorite: false },
    { id: 10, name: "Set 10", isFavorite: false },
  ];

  const navigate = useNavigate();

  const handleCreateNewSet = () => {
    navigate("/create-set");
  };

  const handleEditSets = () => {
    navigate("/edit-set")

  };

  const handleSetFavorite = (id: number) => {
    console.log("Set favorite", id);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px" }}>
      <div
        className="dashboard-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h4" fontWeight="bold" component="h1">
          Your Learning Sets
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCreateNewSet}
        >
          Create new learning set
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEditSets}
        >
          Edit learning set
        </Button>
      </div>
      <Box>
        <Grid container spacing={2} sx={{ overflowY: "scroll" }}>
          {learningSets.map((learningSet) => (
            <Grid item xs={12} sm={6} md={4} key={learningSet.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "counter",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: "200px",
                  maxWidth: "300px",
                  margin: " auto",
                  position: "relative",
                  '&:hover': {
                    transform: 'scale(1.05)', 
                  }
                }}
              >
                <Button
                  onClick={() => handleSetFavorite(learningSet.id)}
                  disableRipple
                  disableFocusRipple
                  sx={{
                    "&:focus": { outline: "none" },
                    "&:hover": { backgroundColor: "#fff" },
                  }}
                >
                  {learningSet.isFavorite ? (
                    // <StarBorderPurple500Icon style={{ color: "gold" }} />
                    <FontAwesomeIcon icon={fasFaStar} color="gold" />
                  ) : (
                    // <StarBorderIcon style={{ color: "black" }} />
                    <FontAwesomeIcon icon={farFaStar} color="black" />
                  )}
                </Button>
                <Typography variant="h6">{learningSet.name}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
