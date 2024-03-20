import { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';

interface CommentsSectionProps {
  existingComments: string[];
  addComment: (comment: string) => void;
}

const CommentsSection = ({
  existingComments,
  addComment,
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');

  const handleNewCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleSubmitComment = () => {
    addComment(newComment);
    setNewComment('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '2%' }}>
        Comments
      </Typography>
      <FormControl
        fullWidth
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <TextField
          sx={{
            marginBottom: '2%',
            marginRight: '1%',
          }}
          fullWidth
          required
          placeholder="Leave a comment..."
          value={newComment}
          onChange={handleNewCommentChange}
        />
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmitComment}
          sx={{ height: '56px' }}
          disabled={!newComment.trim()}
        >
          Submit
        </Button>
      </FormControl>
      <List>
        {existingComments.map((comment, index) => (
          <ListItem key={index}>
            <Typography sx={{ marginBottom: '2%' }}>{comment}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CommentsSection;
