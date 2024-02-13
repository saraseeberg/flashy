import React from "react";
import LearningSetForm from "../components/LearningsetForm";
import FlashcardsForm from "../components/FlashcardsForm";

function CreateLearningSetPage() {
  return (
    <div>
      <h2>Create Learning Set</h2>
      <LearningSetForm />
      <FlashcardsForm learningSetId={""} />
    </div>
  );
}

export default CreateLearningSetPage;
