import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { LearningSet } from "../models/Learningset";
import { db, auth } from "../config/firebase";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LearningsetForm = () => {
  const [learningset, setLearningset] = useState<LearningSet>({
    title: "",
    description: "",
    isPublic: false,
    createdBy: "",
    numberOfLikes: 0,
  });

  const navigate = useNavigate();

  const [isPublic, setIsPublic] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLearningset({ ...learningset, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sjekker om "Title" og "Description" er tomme og viser en alert hvis de er det
    if (
      learningset.title.trim() === "" ||
      learningset.description.trim() === ""
    ) {
      alert("Both Title and Description fields are required.");
      return;
    }

    const documentRef = doc(collection(db, "learningSets"));

    try {
      const newLearningSet = {
        ...learningset,
        isPublic: isPublic,
        createdBy: auth.currentUser?.uid,
        id: documentRef.id,
      };

      await setDoc(documentRef, newLearningSet);
      console.log("Created new learning set.");
      navigate("/edit-set/" + documentRef.id);
    } catch (error) {
      console.error("Error creating learning set: ", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "30%",
        minWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ width: "100%", textAlign: "center" }}>
        Create Learning Set
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        <TextField
          name="title"
          type="text"
          value={learningset.title}
          onChange={handleChange}
          placeholder="Title"
          variant="outlined"
          sx={{ mb: 1, width: "100%" }}
        />
        <TextField
          name="description"
          value={learningset.description}
          onChange={handleChange}
          placeholder="Description"
          variant="outlined"
          sx={{ mb: 1, width: "100%" }}
        />
        <Grid container alignItems="center" sx={{ mb: 1 }}>
          <Grid item>
            <input
              id="Public"
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
          </Grid>
          <Grid item>
            <label htmlFor="Public">Is this deck public?</label>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="contained"
            color="primary"
            size="large"
            style={{
              backgroundColor: "#9F70FD",
              color: "white",
              padding: "5px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              width: "40%",
            }}
          >
            BACK
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            style={{
              backgroundColor: "#9F70FD",
              color: "white",
              padding: "5px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              width: "40%",
            }}
          >
            Create Learningset
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default LearningsetForm;
