import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#9F70FD",
      dark: '#7F27FF',
    },
    secondary: {
      main: "#FDBF60",
      dark: "#FF8911",
    },
  }

});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
