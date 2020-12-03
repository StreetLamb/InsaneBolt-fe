import styled from "styled-components";
import { useState } from "react";
import HighScore from "./HighScore";
import apiUrl from "../utils/api";
import ScoreCommenter from "./ScoreCommenter";

const URL = apiUrl(false);

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 50vh;
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
  color: #5f2d25;
`;

const LoadingText = styled(Score)`
  font-size: 2rem;
  animation: float 1s infinite;

  @keyframes float {
    0% {
      transform: translateY(1rem);
    }
    50% {
      transform: translateY(-1rem);
    }

    100% {
      transform: translateY(1rem);
    }
  }
`;

const ScoreTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  animation: fadein 1s;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
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
  font-size: 1rem;
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
          period: 1440,
        }),
        redirect: "follow",
      };

      fetch(`${URL}/judgescore`, requestOptions)
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
    console.log(requestOptions);

    fetch(`${URL}/scores`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setshowHighscore(false); //remove high score
        rerender(result); //to rerender scoreboard
      });
  };

  return (
    <MainContainer>
      <TitleContainer>
        <h3>
          The game:
          <br />
          Get as close to a lightning strike as possible!
        </h3>
      </TitleContainer>
      <ScoreContainer>
        {isloading ? (
          <LoadingText>Loading...</LoadingText>
        ) : !myDistance ? (
          <LocationButton onClick={checkLocation}>
            <ButtonText>How close am I to getting struck?</ButtonText>
          </LocationButton>
        ) : myDistance > -1 ? (
          <ScoreTextContainer>
            <span>You were</span>
            <Score>{`${myDistance} m`}</Score>
            <span>away from getting struck!</span>
            <br />
            <ScoreCommenter distance={myDistance} />
          </ScoreTextContainer>
        ) : (
          <span>
            We can't detect any lightning strikes currently!
            <br /> Try again later :)
          </span>
        )}
        {showHighscore && myPosition <= 10 ? (
          <HighScore submitName={(name) => submitScore(name, myDistance)} />
        ) : null}
      </ScoreContainer>
    </MainContainer>
  );
};

export default UserScore;
