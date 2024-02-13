import firebase from "firebase/compat/app";

export interface LearningSet {
  id?: string;
  title: string;
  description: string;
  createdAt: firebase.firestore.FieldValue;
}
