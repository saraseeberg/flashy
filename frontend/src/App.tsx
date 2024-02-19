import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#9F70FD",
    },
    secondary: {
      main: "#FDBF60",
    },
  },
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
