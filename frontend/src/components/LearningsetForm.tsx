import { collection, doc, setDoc } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import { LearningSet } from '../models/Learningset';
import { db, auth } from '../config/firebase';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

const LearningsetForm = () => {
  const defaultCategory = 'Select a Category';
  const [learningset, setLearningset] = useState<LearningSet>({
    title: '',
    description: '',
    isPublic: false,
    createdBy: '',
    comments: [],
    numberOfLikes: 0,
    category: '',
  });
  const categories = ['Geography', 'History', 'Programming', 'None'];

  const navigate = useNavigate();

  const [isPublic, setIsPublic] = useState(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setLearningset({ ...learningset, [name as string]: value });
  };

  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLearningset({ ...learningset, [name as string]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      learningset.title.trim() === '' ||
      learningset.description.trim() === ''
    ) {
      alert('Both Title and Description fields are required.');
      return;
    }

    const documentRef = doc(collection(db, 'learningSets'));

    try {
      const newLearningSet = {
        ...learningset,
        isPublic: isPublic,
        createdBy: auth.currentUser?.uid,
        id: documentRef.id,
      };

      await setDoc(documentRef, newLearningSet);
      console.log('Created new learning set.');
      navigate('/edit-set/' + documentRef.id);
    } catch (error) {
      console.error('Error creating learning set: ', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        minWidth: '400px',
        margin: '0 auto',
      }}
    >
      <h2 style={{ width: '100%', textAlign: 'center' }}>
        Create Learning Set
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      >
        <TextField
          name="title"
          type="text"
          value={learningset.title}
          onChange={handleChanges}
          placeholder="Title"
          variant="outlined"
          sx={{ mb: 1, width: '100%' }}
        />
        <TextField
          name="description"
          value={learningset.description}
          onChange={handleChanges}
          placeholder="Description"
          variant="outlined"
          sx={{ mb: 1, width: '100%' }}
        />
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Category</InputLabel>
          <Select
            name="category"
            labelId="simple-select-label"
            id="simple-select"
            value={learningset.category}
            onChange={handleChange}
            label="Category"
            variant="outlined"
            sx={{ mb: 1, width: '100%' }}
          >
            <MenuItem value={defaultCategory} disabled>
              {defaultCategory}
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            color="primary"
            size="large"
            style={{
              backgroundColor: '#9F70FD',
              color: 'white',
              padding: '5px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '40%',
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
              backgroundColor: '#9F70FD',
              color: 'white',
              padding: '5px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '40%',
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
