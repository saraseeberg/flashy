import { Button, Card, CardContent, Typography } from '@mui/material';
import { db } from '../config/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { CardData } from '../models/Flashcard';

interface FlashcardProps {
  card: CardData;
  learningSetId: string;
}

const Flashcard = ({ card, learningSetId }: FlashcardProps) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteDoc(doc(db, 'learningSets', learningSetId, 'cards', card.id));
      console.log('Card deleted');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          {card.front}
        </Typography>
        <Typography color="text.secondary">{card.back}</Typography>
        <Button onClick={handleDelete}>Delete</Button>
      </CardContent>
    </Card>
  );
};

export default Flashcard;
