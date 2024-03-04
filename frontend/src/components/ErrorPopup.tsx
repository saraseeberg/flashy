import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorPopupProps {
  open: boolean;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        display: open ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: "5",
      }}
    >
      <div
        style={{
          height: "21em",
          width: "40em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10em",
          background: "#AC94F4",
          borderRadius: "2em",
          padding: "2em",
        }}
      >
        <Typography variant="h4">
          You do not have access to this page
        </Typography>

        <Button
          onClick={() => {
            onClose();
            navigate("/dashboard");
          }}
          type="submit"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#9F70FD",
            width: "19em",
            height: "5em",
            fontSize: "0.9em",
          }}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            margin: "10px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ErrorPopup;
