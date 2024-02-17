import { Button, Checkbox, FormControlLabel } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import styles from "./ViewCardsStyle.module.css";
import { firestore } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

interface CardData {
  id: string;
  front: string;
  back: string;
  isDifficult: boolean;
}

export default function ViewCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [title, setTitle] = useState("");

  const { setId } = useParams<{ setId?: string }>();

  //USEEFFECT SOM HENTER SETT FRA DATABASEN BASERT PÅ SETID FRA URL, MÅ KOMME FRA DET MAN TRYKKER PÅ I DASHBOARD
  /* Fetch the learning set from the database, based on the ID in the URL */
  useEffect(() => {
    const fetchData = async () => {
      if (!setId) {
        console.error("No learning set ID provided");
        return;
      }

      setLoading(true);

      try {
        const learningSetDoc = await getDoc(
          doc(firestore, "learningSets", setId)
        );

        if (learningSetDoc.exists()) {
          setTitle(learningSetDoc.data().title);

          const querySnapshot = await getDocs(
            collection(firestore, "learningSets", setId, "cards")
          );
          const cardsData = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as CardData
          );
          setCards(cardsData);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, [setId]);

  /* Flips the card back to the front, whenever a new card is displayed */
  useEffect(() => {
    // Hver gang currentCardIndex endres, settes flipped tilbake til false slik at kortet vises på forsiden
    setFlipped(false);
  }, [currentCardIndex]);

  /* Method that flips the card */
  const handleFlipButtonClick = () => {
    setFlipped(!flipped);
  };

  /* Fetch the next card in the set, in a standard order */
  const handleNextCardStandard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length); // Går til neste kort, og begynner på starten hvis vi er på siste kort
  };

  /* Fetch the next card in the set, in a random order */
  const handleNextCardRandom = () => {
    let nextIndex = -1; // Initialize to a value outside the range of valid indices

    while (nextIndex === -1 || nextIndex === currentCardIndex) {
      nextIndex = Math.floor(Math.random() * cards.length);
    }

    setCurrentCardIndex(nextIndex);
  };

  /* Fetch the next card in the set, either in a standard order or in a random order, based on Shuffle-checkbox */
  const handleNextCard = () => {
    const checkbox = document.getElementById(
      "shuffleCheckbox"
    ) as HTMLInputElement | null;

    checkbox?.checked ? handleNextCardRandom() : handleNextCardStandard();
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    ); // Går til forrige kort, og går til siste kort hvis vi er på første kort
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div>
      <div id={styles.outerDiv}>
        <h2>{title || "Loading title..."}</h2>
        <div id={styles.innerDiv}>
          <Card
            key={currentCard.id}
            id={currentCard.id}
            front={currentCard.front}
            back={currentCard.back}
            isDifficult={currentCard.isDifficult}
            isFlipped={flipped}
          />
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  id="shuffleCheckbox"
                  sx={{
                    color: "#9F70FD",
                    "&.Mui-checked": { color: "#9F70FD" },
                  }}
                />
              }
              label="Shuffle cards"
            />
          </div>
          <div id={styles.flipButtonDiv}>
            <Button onClick={handlePrevCard}>
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
            <Button onClick={handleNextCard}>
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
