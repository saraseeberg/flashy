/**
 * Component for adding a new flashcard to a learning set.

 */

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

interface CardFormProps {
  learningSetId: string;
  onSave: () => void;
}

const CardForm = ({ learningSetId, onSave }: CardFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [cardAdded, setCardAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearningSetDetails = async () => {
      const docRef = doc(db, 'learningSets', learningSetId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setDescription(data.description);
      } else {
        console.log('No such document!');
      }
    };

    fetchLearningSetDetails();
  }, [learningSetId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!front || !back) {
      alert('Please fill in both the front and the back of the card.');
      return;
    }

    try {
      await addDoc(collection(db, 'learningSets', learningSetId, 'cards'), {
        front,
        back,
      });
      setFront('');
      setBack('');
      onSave();
      setCardAdded(true);
      console.log('Card added to learning set.');
    } catch (error) {
      console.error('Error adding card to learning set: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 style={{ marginTop: '20px', marginBottom: '0' }}>
        {title || 'Loading title...'}
      </h1>
      <h4
        style={{ fontStyle: 'italic', marginTop: '10px', marginBottom: '20px' }}
      >
        {description || 'Loading description...'}
      </h4>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '20em',
          paddingRight: '20em',
        }}
      >
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
        <Box
          sx={{
            marginTop: '1em',
            marginBottom: '1.5em',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            disabled={!cardAdded}
            type="button"
            variant="contained"
            color="primary"
            style={{
              padding: '20px 45px',
              backgroundColor: cardAdded ? '#9F70FD' : '#B0AEBE',
              marginTop: '1em',
              marginBottom: '1.5em',
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              padding: '20px 45px',
              backgroundColor: '#9F70FD',
              marginTop: '1em',
              marginBottom: '1.5em',
            }}
          >
            Add
          </Button>
        </Box>
      </div>
    </form>
  );
};

export default CardForm;
