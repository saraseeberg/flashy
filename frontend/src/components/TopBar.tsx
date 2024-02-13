import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Logo from "../assets/flashy-logo.svg";

function TopBar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: "#FFBF1F" }}>
        <IconButton edge="start" color="inherit" disabled>
          <img src={Logo} alt="logo" style={{ maxWidth: "50px" }} />
        </IconButton>
        <Typography
          variant="h5"
          noWrap
          style={{ color: "black", paddingLeft: "10px" }}
        >
          FLASHY
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
