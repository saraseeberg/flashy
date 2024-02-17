/**
 * Page for editing a learning set
 *
 * it displays a form for editing the learning set, and a list of flashcards in the spesific learningset that can be edited or deleted.
 */

import { useState, useEffect } from "react";
import CardForm from "../components/FlashcardForm";
import { useParams } from "react-router-dom";
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { LearningSet } from "../models/Learningset";
import { db } from "../config/firebase";
import FlashcardEditor from "../components/FlachcardEditor";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

const EditLearningSetPage = () => {
  const { setId } = useParams<{ setId?: string }>();
  const [learningSet, setLearningSet] = useState<LearningSet | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);

  const refreshFlashcards = async () => {
    if (setId) {
      const querySnapshot = await getDocs(
        collection(db, "learningSets", setId, "cards")
      );
      const cardsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FlashcardData[];
      setFlashcards(cardsData);
    }
  };

  useEffect(() => {
    const fetchLearningSet = async () => {
      if (setId) {
        const docRef = doc(db as Firestore, "learningSets", setId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLearningSet({
            id: docSnap.id,
            ...(docSnap.data() as LearningSet),
          });
        } else {
          console.log("No such document!");
        }
      }
    };

    if (setId) {
      fetchLearningSet();
    }

    const fetchFlashcards = async () => {
      if (setId) {
        const querySnapshot = await getDocs(
          collection(db, "learningSets", setId, "cards")
        );
        const cardsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FlashcardData[];
        setFlashcards(cardsData);
      }
    };

    if (setId) {
      fetchLearningSet();
      fetchFlashcards();
      refreshFlashcards();
    }
  }, [setId]);

  return (
    <div>
      {learningSet && setId ? (
        <>
          <div>
            <CardForm learningSetId={setId} onSave={refreshFlashcards} />
          </div>
          <div>
            <h2>Edit the existing flashcards:</h2>
            {flashcards.map((card) => (
              <FlashcardEditor
                key={card.id}
                card={card}
                learningSetId={setId}
                onSave={refreshFlashcards}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditLearningSetPage;
