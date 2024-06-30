import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import "./App.css";
import Square from "./Square/Square";
import Swal from "sweetalert2";
import CrossIcon from "./assets/CrossIcon";
import CircleIcon from "./assets/CircleIcon";

const renderFrom = [1, 2, 3, 4, 5, 6, 7, 8, 9];

async function takePlayerName() {
  return await Swal.fire({
    title: "Enter Your Name: ",
    input: "text",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
}

const App = () => {
  const [gameState, setGameState] = useState(renderFrom);
  const [winner, setWinner] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);
  const [winGlow, setWinGlow] = useState([]);

  let bottomText = <h3>Re designed by Shoron</h3>;

  useEffect(() => {
    socket.on("connect", (e) => console.log("Client Connected with Server"));
    socket.on("winner", (data) => {
      setWinner(data.winner);
      setWinGlow(data.winGlow);
    });
    socket.on("opponentFound", (data) => {
      setOpponentName(data.opponentName);
      setPlayingAs(data.sign);
    });

    socket.on("playerMove", (data) => {
      setGameState(data);
    });

    socket.on("opponentDisconnected", () => {
      setOpponentName("Offline");
      setTimeout(() => {
        window.location.reload();
      }, 10000);
    });
    return () => {
      socket.off("connect", (e) => console.log("connectedoff"));
      socket.off("opponentFound", (data) => {
        console.log(data);
        setOpponentName(data.opponentName);
      });
    };
  }, [socket]);

  async function playOnlineClick() {
    //connecting with WS
    socket.connect();
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }
    setPlayerName(result.value);
    socket?.emit("request-to-play", { playerName: result.value });
  }

  if (!playerName) {
    return (
      <div className="main-div">
        <button onClick={playOnlineClick} className="play-online">
          Play Online
        </button>
      </div>
    );
  }

  if (playerName && !opponentName) {
    return (
      <div className="main-div">
        <p>Waitting for opponent...</p>
      </div>
    );
  }

  if (winner) {
    if (winner == "draw") {
      bottomText = <h3>Game Is draw</h3>;
    } else {
      bottomText = (
        <div>
          <h1>{`Winner: ${
            playingAs == winner ? playerName : opponentName
          }`}</h1>
        </div>
      );
    }
  }
  

  let currentPlayer = "";
  if (!winner) {
    currentPlayer =
      gameState.filter((el) => typeof el == "string").length % 2 == 0
        ? "cross"
        : "circle";
  } else {
    currentPlayer = winner;
  } //to stop the player bar toggle after winner

  return (
    <div className="main-div">
      <div className="move-detection">
        <div
          className={`left current-move-${
            currentPlayer == playingAs ? currentPlayer : ""
          }`}
        >
          <div className="subicon">
            {playingAs == "cross" ? <CrossIcon /> : <CircleIcon />}
          </div>
          {playerName}
        </div>
        <div
          className={`right current-move-${
            currentPlayer != playingAs ? currentPlayer : ""
          }`}
        >
          <div className="subicon">
            {playingAs == "circle" ? <CrossIcon /> : <CircleIcon />}
          </div>
          {opponentName}
        </div>
      </div>
      <h1 className="water-bg game-heading">Tic Tac Toe</h1>
      <div className="square-wrapper">
        {gameState.map((el, i) => (
          <Square
            winner={winner}
            glow={winGlow.includes(i) ? true : false}
            playingAs={playingAs}
            gameState={gameState}
            setGameState={setGameState}
            key={i}
            element={el}
          />
        ))}
      </div>
      {bottomText}
    </div>
  );
};

export default App;
