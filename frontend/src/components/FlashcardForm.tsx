/**
 * Component for adding a new flashcard to a learning set.

 */

import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface CardFormProps {
  learningSetId: string;
  onSave: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ learningSetId, onSave }) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!front || !back) {
      alert("Please fill in both the front and the back of the card.");
      return;
    }

    try {
      await addDoc(collection(db, "learningSets", learningSetId, "cards"), {
        front,
        back,
      });
      setFront("");
      setBack("");
      onSave();
      console.log("Card added to learning set.");
    } catch (error) {
      console.error("Error adding card to learning set: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Front of the card"
        value={front}
        onChange={(e) => setFront(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Back of the card"
        value={back}
        onChange={(e) => setBack(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ backgroundColor: "#9F70FD" }}
        sx={{ mb: 1 }}
      >
        Add Card
      </Button>
    </form>
  );
};

export default CardForm;
