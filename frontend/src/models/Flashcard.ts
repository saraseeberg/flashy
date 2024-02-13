import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export interface Flashcard {
  id?: string;
  question: string;
  answer: string;
  createdAt: firebase.firestore.FieldValue;
}
