import { Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import styles from "./ViewCardsStyle.module.css";
import { firestore } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { CardData } from "../models/Flashcard";
import CompleteSetPopup from "../components/CompleteSetPopup";
import ShufflePopup from "../components/ShufflePopup";
import {useNavigate} from "react-router-dom";

export default function ViewCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedSet, setCompletedSet] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [title, setTitle] = useState("");
  const [shufflePopupOpen, setShufflePopupOpen] = useState(true);

  const { setId } = useParams<{ setId?: string }>();

  /* Close the shuffle popup */
  const handleShufflePopupClose = () => {
    setShufflePopupOpen(false);
  };
  const navigate = useNavigate();

  /* Provide shuffled cards */
  const handleShuffle = () => {
    shuffleCards();
    handleShufflePopupClose();
  };

  /* Fetch cards without shuffling */
  const handleNoShuffle = () => {
    fetchCards();
    handleShufflePopupClose();
  };

  /* Get the current index of the card */
  function getCurrentIndex() {
    return String(currentCardIndex + 1);
  }

  /* Get the length of the current set */
  function getCurrentSetLength() {
    return String(cards.length);
  }

  //USEEFFECT SOM HENTER SETT FRA DATABASEN BASERT PÅ SETID FRA URL, MÅ KOMME FRA DET MAN TRYKKER PÅ I DASHBOARD
  /* Fetch the learning set from the database, based on the ID in the URL */
  const fetchCards = async () => {
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

  useEffect(() => {
    fetchCards();
  }, [setId]);

  /* Shuffles an array */
  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /* Shuffles the cards */
  const shuffleCards = () => {
    const shuffledCards = shuffleArray([...cards]);
    setCards(shuffledCards);
  };

  /* Flips the card back to the front, whenever a new card is displayed */
  useEffect(() => {
    setFlipped(false);
  }, [currentCardIndex]);

  /* Flips the card */
  const handleFlipButtonClick = () => {
    setFlipped(!flipped);
  };

  /* Fetch the next card in the set, in a standard order */
  const handleNextCardStandard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);

    if (currentCardIndex === cards.length - 1) {
      setCompletedSet(true);
    }
  };

  /* Fetch the previous card in the set */
  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
        <CircularProgress />;
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div>
      {shufflePopupOpen && (
        <ShufflePopup
          open={shufflePopupOpen}
          onClose={handleShufflePopupClose}
          onShuffle={handleShuffle}
          onNoShuffle={handleNoShuffle}
        />
      )}
      {completedSet ? (
        <CompleteSetPopup
          onClose={() => {
            setCompletedSet(false);
          }}
          onRestart={() => {
            setCompletedSet(false);
            setShufflePopupOpen(true);
            setCurrentCardIndex(0);
          }}
        />
      ) : (
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
              <Typography>
                {" "}
                {getCurrentIndex()}/{getCurrentSetLength()}{" "}
              </Typography>
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
              <Button onClick={handleNextCardStandard}>
                <ArrowForwardIcon />
              </Button>
            </div>
            <div id={styles.backButtonDiv}>
              <Button onClick={() => navigate('/dashboard')} 
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
      )}
    </div>
  );
}
