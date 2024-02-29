import "./App.css";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "./components/TopBar";

function App() {
  return (
    <Box sx={{ height: "100vh", width: "100vw", overflowX: "hidden" }}>
      <TopBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
