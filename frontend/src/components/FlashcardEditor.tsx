/**
 * Component for editing flashcards.
 *
 * Can be used to edit the front and back of a flashcard, and to delete the flashcard.
 */

import { useState } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { db } from '../config/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { CardData } from '../models/Flashcard';

interface FlashcardEditorProps {
  card: CardData;
  learningSetId: string;
  onSave: () => void;
}

const FlashcardEditor = ({
  card,
  learningSetId,
  onSave,
}: FlashcardEditorProps) => {
  const [editMode, setEditMode] = useState(false);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  const handleSave = async () => {
    const cardRef = doc(db, 'learningSets', learningSetId, 'cards', card.id);
    await updateDoc(cardRef, { front, back });
    console.log('Card updated');
    setEditMode(false);
    onSave();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteDoc(doc(db, 'learningSets', learningSetId, 'cards', card.id));
      console.log('Card deleted');
      onSave();
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        {editMode ? (
          <>
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
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Typography variant="h6" component="div">
              {front}
            </Typography>
            <Typography color="text.secondary">{back}</Typography>
            <Button
              onClick={() => setEditMode(true)}
              style={{ color: '#7F27FF' }}
            >
              Edit
            </Button>
            <Button onClick={handleDelete} style={{ color: '#7F27FF' }}>
              Delete
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashcardEditor;
