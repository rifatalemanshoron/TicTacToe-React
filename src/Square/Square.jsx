import "./Square.css";
import { socket } from "../socket";
import { circleSvg, crossSvg } from "../assets/icon";

const Square = ({
  winner,
  glow,
  playingAs,
  element,
  gameState,
  setGameState,
}) => {
  let currentPlayer =
    gameState.filter((el) => typeof el == "string").length % 2 == 0
      ? "cross"
      : "circle";

  function handleClick() {
    if (playingAs == currentPlayer && !winner) {
      setGameState((prevState) => {
        let newState = [...prevState];     //Shallow copy na korle re render hobe na.
        newState[element - 1] = playingAs; //let newState = prevState dile newState prevState eri reference jake mutate kora jabe na
        socket.emit("playerMove", newState);
        return newState;
      });
    } else return;
  }
  return (
    <div
      onClick={handleClick}
      className={`square ${currentPlayer == playingAs ? "" : "disable"} ${
        glow ? element + "-won" : ""
      } ${winner ? "disable" : ""}`}
    >
      {element == "cross" ? crossSvg : element == "circle" ? circleSvg : ""}
    </div>
  );
};

export default Square;
