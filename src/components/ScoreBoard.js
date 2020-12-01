import { useEffect, useState } from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f4f2f6;
  border-radius: 2rem 2rem 0 0;
  min-height: 50vh;
  padding-bottom: 1rem;
`;

const StyledRow = styled.td`
  padding: 1rem;
`;

const topScoreColor = {
  0: "#FFD700",
  1: "#C0C0C0",
  2: "#cc6633",
};

const StyledIndex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.index < 3 ? topScoreColor[props.index] : null};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  color: ${(props) => (props.index < 3 ? "#f4f2f6" : "black")};
`;

const ScoreBoard = ({ rerender }) => {
  const [scores, setScores] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:3007/scores", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setScores(result);
      })
      .catch((error) => console.log("error", error));
  }, [rerender]);
  return (
    <MainContainer>
      <h1>Leaderboard</h1>

      {scores.length ? (
        <table>
          <tbody>
            {scores.map((score, idx) => {
              return (
                <tr key={score.id}>
                  <StyledRow>
                    <StyledIndex index={idx}>{idx + 1}</StyledIndex>
                  </StyledRow>
                  <StyledRow>{score.username}</StyledRow>
                  <StyledRow>{score.distance}</StyledRow>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <span>Nothing yet!</span>
      )}
    </MainContainer>
  );
};

export default ScoreBoard;
