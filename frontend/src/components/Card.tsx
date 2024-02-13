type CardProps = {
  question: string;
  answer: string;
};

const Card: React.FC<CardProps> = ({ question, answer }) => {
  return (
    <div
      className="card-container"
      style={{ padding: "2em", background: "pink" }}
    >
      <div className="card">
        <div className="front">
          <div className="question">{question}</div>
        </div>
        <div className="back">
          <div className="answer">{answer}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
