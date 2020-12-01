import styled from "styled-components";
import { useState } from "react";
import HighScore from "./HighScore";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 50vh;
  padding: 1rem;
`;

const TitleContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 2;
  padding: 2rem 0;
`;

const Score = styled.span`
  font-size: 3.5rem;
  font-weight: bold;
`;

const LocationButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 100%;
  height: 10rem;
  width: 10rem;
  background-color: #f4f2f6;
  box-shadow: 7px 7px 5px 0px rgba(250, 165, 16, 0.75);
  cursor: pointer;
`;

const ButtonText = styled.span`
  color: #faa510;
  font-size: 1.5rem;
  font-weight: bold;
`;

const UserScore = ({ rerender }) => {
  const [myDistance, setMyDistance] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const [myPosition, setMyPosition] = useState(99999); //scoreboard position
  const [showHighscore, setshowHighscore] = useState(true);

  const checkLocation = () => {
    setIsloading(true);
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      setIsloading(false);
    };

    //if success, post lat lng
    const success = (pos) => {
      setshowHighscore(true);
      const { latitude, longitude } = pos.coords;

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: latitude,
          lng: longitude,
        }),
        redirect: "follow",
      };

      fetch("http://localhost:3007/judgescore", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          const { distance, scorePosition } = result;
          setMyDistance(`${distance}`);
          setMyPosition(scorePosition);
          setIsloading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsloading(false);
        });
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  const submitScore = (username, distance) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        distance,
      }),
      redirect: "follow",
    };

    fetch("http://localhost:3007/scores", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setshowHighscore(false); //remove high score
        rerender(result); //to rerender scoreboard
      });
  };

  return (
    <MainContainer>
      <TitleContainer>
        <h2>Compete who is closest to being zapped!</h2>
      </TitleContainer>
      <ScoreContainer>
        {isloading ? (
          <Score>Loading...</Score>
        ) : !myDistance ? (
          <LocationButton onClick={checkLocation}>
            <ButtonText>How close was I?</ButtonText>
          </LocationButton>
        ) : myDistance > -1 ? (
          <>
            <span>You were</span>
            <Score>{`${myDistance} m`}</Score>
            <span>away from the nearest lightning strike!</span>
          </>
        ) : (
          <span>No lightning activity currently</span>
        )}
        {showHighscore && myPosition < 10 ? (
          <HighScore submitName={(name) => submitScore(name, myDistance)} />
        ) : null}
      </ScoreContainer>
    </MainContainer>
  );
};

export default UserScore;
