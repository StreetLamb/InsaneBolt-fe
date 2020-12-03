import "./App.css";
import ScoreBoard from "./components/ScoreBoard";
import UserScore from "./components/UserScore";
import { useState } from "react";

function App() {
  const [rerender, setRerender] = useState(0);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        backgroundImage: "linear-gradient(#FDCD2A,#ff6a00)",
        minHeight: "100vh",
        maxWidth: "768px",
      }}
    >
      <UserScore rerender={() => setRerender(rerender + 1)} />
      <ScoreBoard rerender={rerender} />
    </div>
  );
}

export default App;
