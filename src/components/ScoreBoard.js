import { useEffect, useState } from "react";
import styled from "styled-components";
import apiUrl from "../utils/api";

const URL = apiUrl(false);

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f4f2f6;
  border-radius: 2rem 2rem 0 0;
  min-height: 50vh;
  padding-bottom: 1rem;
  animation: slideup 0.5s;
  width: 100%;

  @keyframes slideup {
    from {
      transform: translateY(100vh);
    }
    to {
      transform: translateY(0rem);
    }
  }
`;

const StyledTR = styled.tr`
  animation: slideup 0.5s;
  animation-delay: ${(props) => props.index * 0.1}s;

  @keyframes slideup {
    from {
      opacity: 0;
      transform: translateY(100vh);
    }
    to {
      opacity: 1;
      transform: translateY(0rem);
    }
  }
`;

const StyledRow = styled.td`
  padding: 1rem;
  font-weight: bold;
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

    fetch(`${URL}/scores`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setScores(result);
      })
      .catch((error) => console.log("error", error));
  }, [rerender]);
  return (
    <MainContainer>
      <h2>⚡ Top 10 MadLads ⚡</h2>

      {scores.length ? (
        <table>
          <tbody>
            {scores.map((score, idx) => {
              return (
                <StyledTR key={score.id} index={idx}>
                  <StyledRow>
                    <StyledIndex index={idx}>{idx + 1}</StyledIndex>
                  </StyledRow>
                  <StyledRow>{score.username}</StyledRow>
                  <StyledRow>{score.distance}</StyledRow>
                </StyledTR>
              );
            })}
          </tbody>
        </table>
      ) : (
        <span>Be the first!</span>
      )}
    </MainContainer>
  );
};

export default ScoreBoard;
