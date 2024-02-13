import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";

export default function ViewCards() {
  return (
    <div>
      <div>
        <Button>Back</Button>
      </div>
      <div>
        <h2>Title of learningSet</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: "80%" }}>
            <Card
              question={"Hva er hovedstaden i Norge?"}
              answer={"Oslo"}
            ></Card>
          </div>
          <div>
            <Button>
              <ArrowBackIcon />
            </Button>
            <Button>Flip</Button>
            <Button>
              <ArrowForwardIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
