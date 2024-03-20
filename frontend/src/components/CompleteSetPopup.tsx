import { Button, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';

interface PopUpProps {
  onClose: () => void;
  onRestart: () => void;
}

const CompleteSetPopup = ({ onRestart, onClose }: PopUpProps) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
      }}
    >
      <div
        className="popupcontainer"
        style={{
          height: '24em',
          width: '44em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          background: '#AC94F4',
          borderRadius: '2em',
          padding: '2em',
        }}
      >
        <Typography variant="h4">
          {' '}
          Congratulations!
          <br></br> - You have completed the learning set -{' '}
        </Typography>

        <div>
          <EmojiEventsIcon
            sx={{ width: '5em', height: '5em', color: '#FFBF1F' }}
          ></EmojiEventsIcon>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-evenly',
            margin: '10px',
          }}
        >
          <Button
            onClick={() => {
              onClose();
              navigate('/dashboard');
            }}
            type="submit"
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
            <DashboardIcon
              sx={{ fontSize: '2.3em', marginRight: '0.4em' }}
            ></DashboardIcon>
            Return to Dashboard
          </Button>
          <div>
            <Button
              onClick={onRestart}
              type="submit"
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
              <RestartAltIcon
                sx={{ fontSize: '2.3em', marginRight: '0.4em' }}
              ></RestartAltIcon>
              Restart Learning Set
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompleteSetPopup;
