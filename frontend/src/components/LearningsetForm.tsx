import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { LearningSet } from "../models/Learingset";
import { db } from "../config/firebase";
import { Button, TextField } from "@mui/material";

const learningsetform = () => {
  const [learingset, setlearingset] = useState<LearningSet>({
    title: "",
    description: "",
    createdAt: serverTimestamp(), // skal vi forstatt ha timestamp her eller skal vi slette?
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setlearingset({ ...learingset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "learningsets"), {
        ...learingset,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
      <TextField
        name="title"
        type="text"
        value={learingset.title}
        onChange={handleChange}
        placeholder="Title"
        variant="outlined"
        sx={{ mb: 1}}
      />
      <TextField
        name="description"
        value={learingset.description}
        onChange={handleChange}
        placeholder="Description"
        variant="outlined"
        sx={{ mb: 1}}
      />
      <Button 
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >Create Learingset
      </Button>
    </form>
  );
};

export default learningsetform;
