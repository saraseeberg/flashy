import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { LearningSet } from "../models/Learningset";
import { db } from "../config/firebase";
import { Button, Grid, TextField } from "@mui/material";

const LearningsetForm = () => {
  const [learningset, setlearningset] = useState<LearningSet>({
    title: "",
    description: "",
    isPublic: false,
    createdBy: "",
  });

  const [isPublic, setIsPublic] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setlearningset({ ...learningset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Opprett en referanse til et nytt dokument i 'learningSets' samlingen
    const documentRef = doc(collection(db, "learningSets"));

    try {
      // Opprett et nytt objekt for å sette i databasen
      const newLearningSet = {
        ...learningset,
        id: documentRef.id, // Bruk den genererte IDen til dokumentreferansen
      };

      // Bruk setDoc for å skrive dokumentet til databasen
      await setDoc(documentRef, newLearningSet);
      console.log("Created new learning set.");
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
              checked={isPublic ? true : false}
              onChange={() => setIsPublic(!isPublic)}
            />
          </Grid>
          <Grid item>
            <label htmlFor="Public">Is this deck public?</label>
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Create Learningset
        </Button>
      </form>
    </div>
  );
};

export default LearningsetForm;
