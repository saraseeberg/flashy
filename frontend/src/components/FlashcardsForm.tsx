import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Flashcard } from "../models/Flashcard";

interface FlashcardsProps {
  learningSetId: string;
}

const Flashcards: React.FC<FlashcardsProps> = ({ learningSetId }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const q = query(
        collection(db, "flashcards"),
        where("learningSetId", "==", learningSetId)
      );
      const querySnapshot = await getDocs(q);
      const flashcardsData: Flashcard[] = [];
      querySnapshot.forEach((doc) => {
        flashcardsData.push({ id: doc.id, ...doc.data() } as Flashcard);
      });
      setFlashcards(flashcardsData);
    };

    fetchFlashcards();
  }, [learningSetId]);

  return (
    <div>
      {flashcards.map((flashcard) => (
        <div key={flashcard.id}>
          <h3>{flashcard.question}</h3>
          <p>{flashcard.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default Flashcards;
