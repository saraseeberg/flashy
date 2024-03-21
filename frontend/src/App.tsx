import { Outlet } from 'react-router-dom';
import TopBar from './components/TopBar';
import { Box } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        textAlign: 'center',
      }}
    >
      <TopBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
