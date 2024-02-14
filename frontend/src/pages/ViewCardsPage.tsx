import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";
import { useState } from "react";

export default function ViewCards() {
  const [flipped, setFlipped] = useState(false);

  const handleFlipButtonClick = () => {
    setFlipped(!flipped);
  };
  return (
    <div>
      <div style={{ padding: "2em" }}>
        <h2>Title of learningSet</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div>
            <Card
              question={"Hvem er den beste PU gruppa?"}
              answer={"Gruppe 50"}
              isFlipped={flipped}
            ></Card>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              padding: "1em",
              maxWidth: "20em",
            }}
          >
            <Button>
              <ArrowBackIcon />
            </Button>
            <Button
              onClick={handleFlipButtonClick}
              type="button"
              fullWidth
              variant="contained"
              style={{
                background: "#d3d3d3",
                opacity: "0.5",
                color: "black",
              }}
            >
              Flip
            </Button>
            <Button>
              <ArrowForwardIcon />
            </Button>
          </div>
          <div
            style={{
              width: "100%",
              padding: "1em",
              maxWidth: "10em",
            }}
          >
            <Button
              type="button"
              fullWidth
              variant="contained"
              style={{
                background: "#d3d3d3",
                maxWidth: "20em",
                opacity: "0.5",
                color: "black",
              }}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
