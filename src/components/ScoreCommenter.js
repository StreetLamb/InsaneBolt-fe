const ScoreCommenter = ({ distance }) => {
  return (
    <span>
      "
      {distance < 10
        ? "Damn bro, you are certified insane!"
        : distance < 100
        ? "Not too shabby my friend."
        : distance < 500
        ? "Not bad."
        : distance < 1000
        ? "Try harder bruh."
        : "Are you even trying??"}
      "
    </span>
  );
};

export default ScoreCommenter;
