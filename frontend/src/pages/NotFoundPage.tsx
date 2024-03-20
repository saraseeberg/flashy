import { Box, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
      }}
    >
      <Typography
        component="h1"
        variant="h1"
        fontWeight={'bold'}
        style={{ textAlign: 'center' }}
      >
        {' '}
        Page not found
      </Typography>
      <Typography
        component="h1"
        variant="h6"
        fontWeight={'bold'}
        style={{ textAlign: 'center' }}
      >
        The path you have specified does not exist. Please press on the app-logo
        to return back to the main-page or specify a valid path.
      </Typography>
    </Box>
  );
}
