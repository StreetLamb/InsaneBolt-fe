import styled from "styled-components";
import { useState } from "react";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border: none;
  margin: 0.5rem 0.5rem 0 0;
  border-radius: 0.5rem;
`;

const Button = styled.span`
  font-size: 1rem;
  cursor: pointer;
`;

const HighScore = ({ submitName }) => {
  const [name, setName] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const submitHandler = () => {
    if (name.length) {
      submitName(name);
    } else {
      setShowError(true);
    }
  };

  return (
    <MainContainer>
      <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
        Wohoo! You earn a place on the scoreboard!
      </span>
      <div style={{ marginBottom: ".5rem" }}>
        <StyledInput
          type="text"
          name="name"
          onChange={handleChange}
          value={name}
          placeholder="Enter nickname"
          required
        />
        <Button onClick={() => submitHandler(name)}>&rarr;</Button>
      </div>
      {showError ? (
        <span style={{ color: "red" }}>Input must be filled!</span>
      ) : null}
    </MainContainer>
  );
};

export default HighScore;
