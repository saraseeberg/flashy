import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { LearningSet } from "../models/Learingset";
import { db } from "../config/firebase";

const learningsetform = () => {
  const [learingset, setlearingset] = useState<LearningSet>({
    title: "",
    description: "",
    createdAt: serverTimestamp(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setlearingset({ ...learingset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "learningsets"), {
        ...learingset,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        value={learingset.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <textarea
        name="description"
        value={learingset.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <button type="submit">Create Learingset</button>
    </form>
  );
};

export default learningsetform;
