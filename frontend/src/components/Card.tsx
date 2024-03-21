import { ChangeEvent } from 'react';
import { CardData } from '../models/Flashcard';
import { Checkbox, FormControlLabel } from '@mui/material';

interface CardProps extends CardData {
  onDifficultyChange: (id: string, isDifficult: boolean) => void;
}

const Card = ({
  id,
  front,
  back,
  isDifficult,
  isFlipped,
  onDifficultyChange,
}: CardProps) => {
  const handleDifficultyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newIsDifficult = event.target.checked;
    onDifficultyChange(id, newIsDifficult);
  };
  return (
    <div
      className="card-container"
      style={{
        height: '20em',
        width: '40em',
        padding: '2em',
        display: 'flex',
        background: '#AC94F4',
        maxWidth: '40em',
        borderRadius: '2em',
        zIndex: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '40em',
          gap: '2em',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {isFlipped ? <p> Answer</p> : <p> Question </p>}
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  id="difficultyCheckbox"
                  checked={isDifficult}
                  onChange={handleDifficultyChange}
                  sx={{
                    color: '#9F70FD',
                    '&.Mui-checked': { color: '#9F70FD' },
                    zIndex: '3',
                  }}
                />
              }
              label="Difficult card?"
            />
          </div>
        </div>

        <div
          className="card"
          style={{
            maxHeight: '20em',
            maxWidth: '40em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isFlipped ? (
            <div
              className="answer"
              style={{
                fontSize: '2em',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                height: '100%',
              }}
            >
              {back}
            </div>
          ) : (
            <div
              className="question"
              style={{
                fontSize: '2em',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                height: '100%',
              }}
            >
              {front}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
