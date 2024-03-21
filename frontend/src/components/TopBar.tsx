import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Logo from '../assets/flashy-logo.svg';
import { Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import useUserRole from '../hooks/useRole';

function TopBar() {
  const { isAuthenticated, logout } = useAuth();
  const userRole = useUserRole();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="sticky" sx={{ width: '100vw' }}>
      <Toolbar
        sx={{
          backgroundColor: '#FFBF1F',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ outline: 'none', '&:focus': { outline: 'none' } }}
          >
            <img src={Logo} alt="logo" style={{ maxWidth: '50px' }} />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            style={{ color: 'black', paddingLeft: '10px' }}
          >
            FLASHY
          </Typography>
        </Box>
        {isAuthenticated && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {userRole === 'user' ? null : (
                <div>
                  <Button
                    variant="contained"
                    startIcon={<SupervisorAccountIcon />}
                    onClick={() => navigate('/adminpage')}
                    sx={{}}
                  >
                    Admin Page
                  </Button>
                </div>
              )}
              <Avatar
                onClick={handleAvatarClick}
                sx={{ cursor: 'pointer', marginLeft: '1em' }}
              />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSettings}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
