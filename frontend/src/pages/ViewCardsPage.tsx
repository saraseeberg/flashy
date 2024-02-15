import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";
import { useState } from "react";
import styles from "./ViewCardsStyle.module.css";

export default function ViewCards() {
  const [flipped, setFlipped] = useState(false);

  const handleFlipButtonClick = () => {
    setFlipped(!flipped);
  };
  return (
    <div>
      <div id={styles.outerDiv}>
        <h2>Title of learningSet</h2>
        <div id={styles.innerDiv}>
          <Card
            question={
              "Hvem er den beste PU gruppa i hele verden overalt på jord? "
            }
            answer={"Gruppe 50"}
            isFlipped={flipped}
          ></Card>
          <div id={styles.flipButtonDiv}>
            <Button>
              <ArrowBackIcon />
            </Button>
            <Button
              id={styles.flipButton}
              onClick={handleFlipButtonClick}
              type="button"
              fullWidth
              variant="contained"
            >
              Flip
            </Button>
            <Button>
              <ArrowForwardIcon />
            </Button>
          </div>
          <div id={styles.backButtonDiv}>
            <Button
              id={styles.backButton}
              type="button"
              fullWidth
              variant="contained"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
