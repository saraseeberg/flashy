import { useState, useEffect } from "react";
import CardForm from "../components/FlashcardForm";
import { useParams } from "react-router-dom";
import { Firestore, doc, getDoc } from "firebase/firestore"; // Sørg for at du importerer Firestore typen riktig
import { LearningSet } from "../models/Learningset";
import { db } from "../config/firebase";

// Sørg for at db er av typen Firestore
const EditLearningSetPage = () => {
  const { setId } = useParams<{ setId?: string }>(); // Legg merke til at setId er optional
  const [learningSet, setLearningSet] = useState<LearningSet | null>(null);

  useEffect(() => {
    const fetchLearningSet = async () => {
      if (setId) { // Legger til en sjekk for å sikre at setId er definert
        const docRef = doc(db as Firestore, "learningSets", setId); // Cast db til Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLearningSet({ id: docSnap.id, ...(docSnap.data() as LearningSet) });
        } else {
          console.log("No such document!");
        }
      }
    };

    if (setId) {
      fetchLearningSet();
    }
  }, [setId]);

  return (
    <div>
      {learningSet && setId ? ( // Sjekker at setId og learningSet eksisterer
        <>
          <CardForm learningSetId={setId} />
        </>
      ) : (
        <p>Loading...</p>
      )}
      
    </div>
  );
};

export default EditLearningSetPage;
