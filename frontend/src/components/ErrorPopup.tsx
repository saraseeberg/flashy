import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ErrorIcon from '@mui/icons-material/Error';

interface ErrorPopupProps {
  open: boolean;
  onClose: () => void;
}

const ErrorPopup = ({ open, onClose }: ErrorPopupProps) => {
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

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
          height: '15em',
          width: '30em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10em',
          background: '#AC94F4',
          borderRadius: '2em',
          padding: '2em',
        }}
      >
        <Typography variant="h5" fontWeight={500}>
          {' '}
          Oops...
          <br></br>you do not have access to this page!{' '}
        </Typography>

        <div>
          <ErrorIcon
            sx={{
              width: '4em',
              height: '4em',
              color: '#e05443',
              paddingTop: '0.5em',
            }}
          ></ErrorIcon>
        </div>

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
            width: '20em',
            height: '4em',
            fontSize: '0.9em',
          }}
          sx={{ mt: 2 }}
        >
          <DashboardIcon
            sx={{ fontSize: '2.3em', marginRight: '0.4em' }}
          ></DashboardIcon>
          Go back
        </Button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            margin: '10px',
          }}
        ></div>
      </div>
    </div>
  );
};

export default ErrorPopup;
