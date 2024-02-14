type CardProps = {
  question: string;
  answer: string;
  isFlipped: boolean;
};

const Card: React.FC<CardProps> = ({ question, answer, isFlipped }) => {
  return (
    <div
      className="card-container"
      style={{
        height: "20em",
        width: "40em",
        padding: "2em",
        display: "flex",
        justifyContent: "center",
        background: "#AC94F4",
        maxWidth: "40em",
      }}
    >
      <div
        className="card"
        style={{
          maxHeight: "20em",
          maxWidth: "40em",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isFlipped ? (
          <div
            className="answer"
            style={{
              fontSize: "2em",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {answer}
          </div>
        ) : (
          <div
            className="question"
            style={{
              fontSize: "2em",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {question}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
