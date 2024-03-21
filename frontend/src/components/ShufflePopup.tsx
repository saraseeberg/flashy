import { Button, Typography } from '@mui/material';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import NotListedLocationSharpIcon from '@mui/icons-material/NotListedLocationSharp';

interface ShufflePopupProps {
  open: boolean;
  onClose: () => void;
  onShuffle: () => void;
  onNoShuffle: () => void;
}

const ShufflePopup = ({ open, onShuffle, onNoShuffle }: ShufflePopupProps) => {
  return (
    <div
      style={{
        display: open ? 'flex' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: '5',
      }}
    >
      <div
        style={{
          height: '21em',
          width: '40em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          marginTop: '10em',
          background: '#AC94F4',
          borderRadius: '2em',
          padding: '2em',
        }}
      >
        <Typography variant="h4">
          Do you want the cards to be shuffled?
        </Typography>

        <div>
          <NotListedLocationSharpIcon
            sx={{ width: '5em', height: '5em', color: '#FFBF1F' }}
          ></NotListedLocationSharpIcon>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            margin: '10px',
          }}
        >
          <Button
            onClick={onNoShuffle}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: '#9F70FD',
              width: '19em',
              height: '5em',
              fontSize: '0.9em',
            }}
            sx={{ mb: 1 }}
          >
            <ShuffleIcon
              sx={{ fontSize: '2.3em', marginRight: '0.4em' }}
            ></ShuffleIcon>
            No shuffle!
          </Button>
          <Button
            onClick={onShuffle}
            variant="contained"
            color="primary"
            style={{
              backgroundColor: '#9F70FD',
              width: '19em',
              height: '5em',
              fontSize: '0.9em',
            }}
            sx={{ mb: 1 }}
          >
            <ShuffleOnIcon
              sx={{ fontSize: '2.3em', marginRight: '0.4em' }}
            ></ShuffleOnIcon>
            Shuffle!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShufflePopup;
