import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import styles from "./ViewCardsStyle.module.css";
import { firestore } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Begynner å laste inn
      try {
        // Henter tittelen fra learningSet
        const learningSetDoc = await getDoc(
          doc(firestore, "learningSets", "exampleSet") //her må det byttes ut til å hente variabler som bruker har trykket på
        );
        if (learningSetDoc.exists()) {
          setTitle(learningSetDoc.data().title); // Setter tittelen
        } else {
          console.log("No such document!");
        }

        // Henter kortene
        const querySnapshot = await getDocs(
          collection(firestore, "learningSets", "exampleSet", "cards")
        );
        const cardsData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as CardData
        );
        setCards(cardsData);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
      setLoading(false); // Avslutter lastingen
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Hver gang currentCardIndex endres, settes flipped tilbake til false slik at kortet vises på forsiden
    setFlipped(false);
  }, [currentCardIndex]); 

  const handleFlipButtonClick = () => {
    setFlipped(!flipped);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length); // Går til neste kort, og begynner på starten hvis vi er på siste kort
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
