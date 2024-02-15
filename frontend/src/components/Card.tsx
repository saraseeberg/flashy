export type Cards = {
  id: string;
  front: string;
  back: string;
  isFlipped: boolean;
  isDifficult: boolean;
};

const Card: React.FC<Cards> = ({ front, back, isDifficult, isFlipped, id }) => {
  return (
    <div
      className="card-container"
      style={{
        height: "20em",
        width: "40em",
        padding: "2em",
        display: "flex",
        background: "#AC94F4",
        maxWidth: "40em",
        borderRadius: "2em",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "40em",
          gap: "2em",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {isFlipped ? <p> Answer</p> : <p> Question </p>}
          <p> Difficulty</p>
        </div>

        <div
          className="card"
          style={{
            maxHeight: "20em",
            maxWidth: "40em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFlipped ? (
            <div
              className="answer"
              style={{
                fontSize: "2em",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                height: "100%",
              }}
            >
              {back}
            </div>
          ) : (
            <div
              className="question"
              style={{
                fontSize: "2em",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                height: "100%",
              }}
            >
              {front}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
