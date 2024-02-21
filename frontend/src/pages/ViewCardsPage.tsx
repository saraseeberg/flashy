import { Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Card from "../components/Card";
import { useCallback, useEffect, useState } from "react";
import styles from "./ViewCardsStyle.module.css";
import { firestore } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { CardData } from "../models/Flashcard";
import CompleteSetPopup from "../components/CompleteSetPopup";
import ShufflePopup from "../components/ShufflePopup";
import { useNavigate } from "react-router-dom";

export default function ViewCards() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedSet, setCompletedSet] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [title, setTitle] = useState("");
  const [shufflePopupOpen, setShufflePopupOpen] = useState(true);
  const [difficultCards, setDifficultCards] = useState<CardData[]>([]);
  const [inDifficultMode, setInDifficultMode] = useState(false);

  const { setId } = useParams<{ setId?: string }>();

  /* Close the shuffle popup */
  const handleShufflePopupClose = () => {
    setShufflePopupOpen(false);
  };
  const navigate = useNavigate();

  /* Shuffle the cards */
  const handleShuffle = () => {
    shuffleCards();
    handleShufflePopupClose();
  };

  /* Shuffle the cards */
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
    const length = inDifficultMode ? difficultCards.length : cards.length;
    return String(length);
  }

  //USEEFFECT SOM HENTER SETT FRA DATABASEN BASERT PÅ SETID FRA URL, MÅ KOMME FRA DET MAN TRYKKER PÅ I DASHBOARD
  /* Fetch the learning set from the database, based on the ID in the URL */
  const fetchCards = useCallback(async () => {
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
  }, [setId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards, setId]);

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

  /* Fetch the previous card in the set */
  const handlePrevCard = () => {
    const currentCards = inDifficultMode ? difficultCards : cards;

    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + currentCards.length) % currentCards.length
    );
  };

  /* Fetch the next card in the set */
  const handleNextCardStandard = () => {
    if (!inDifficultMode) {
      // If not in difficult mode, proceed with non-difficult cards
      setCurrentCardIndex((prevIndex) => prevIndex + 1);

      if (currentCardIndex === cards.length - 1) {
        // If reached the end of non-difficult cards
        if (difficultCards.length > 0) {
          // If there are difficult cards, switch to difficult mode
          setInDifficultMode(true);
          setCurrentCardIndex(0); // Start with the first difficult card
        } else {
          // If no difficult cards, set the set as completed
          setCompletedSet(true);
        }
      }
    } else {
      // If in difficult mode, proceed with difficult cards
      setCurrentCardIndex((prevIndex) => prevIndex + 1);

      if (currentCardIndex === difficultCards.length - 1) {
        setCurrentCardIndex(0);
      }
    }
  };

  /* Handle the change of the difficulty checkbox */
  const handleDifficultyChange = (cardId: string, newIsDifficult: boolean) => {
    // Find the card in the main list
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, isDifficult: newIsDifficult } : card
    );

    setCards(updatedCards);

    // Update the difficult cards list based on the checkbox status
    const updatedDifficultCards = updatedCards.filter(
      (card) => card.isDifficult
    );

    if (inDifficultMode && currentCardIndex === difficultCards.length - 1) {
      setCurrentCardIndex(0);
    }

    setDifficultCards(updatedDifficultCards);

    if (inDifficultMode && updatedDifficultCards.length === 0) {
      setCompletedSet(true);
    }
  };

  if (loading) {
    return (
      <div>
        <p>Loading...</p>
        <CircularProgress />
      </div>
    );
  }

  /* Get the current card, based on difficultyMode */
  const currentCard = inDifficultMode
    ? difficultCards[currentCardIndex]
    : cards[currentCardIndex];

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
            setInDifficultMode(false);
            setCurrentCardIndex(0);
            setShufflePopupOpen(true);
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
              onDifficultyChange={handleDifficultyChange}
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
              <Button
                onClick={() => navigate("/dashboard")}
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
