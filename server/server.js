const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 8000
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://tictactoereactbyshoron.netlify.app", //"http://localhost:5173/" <= Dont Write link this way
    //methods: ["GET", "POST"]       // The link must change during deployment
  },
});

let activePlayingPair = [];
let playerQueue = [];

io.on("connection", (socket) => {
  console.log("Conn:", socket.id);
  socket.on("request-to-play", (data) => {
    playerQueue.push({ socket, online: true, playerName: data.playerName });
    if (playerQueue.length >= 2) {
      let player1 = {
        identity: playerQueue[0],
        sign: "circle",
      };
      let player2 = {
        identity: playerQueue[1],
        sign: "cross",
      };
      let playingPair = { player1, player2 };
      activePlayingPair.push(playingPair);
      playerQueue = [];

      player1.identity.socket.emit("opponentFound", {
        opponentName: player2.identity.playerName,
        sign: player2.sign,
      });
      player2.identity.socket.emit("opponentFound", {
        opponentName: player1.identity.playerName,
        sign: player1.sign,
      });
    }

    socket.on("playerMove", (data) => {
      let targetObject = activePlayingPair.find((playerPair) => {
        return (
          playerPair.player1.identity.socket.id == socket.id ||
          playerPair.player2.identity.socket.id == socket.id
        );
      });
      //console.log("Targert: ", targetObject)
      console.log(data);

      targetObject.player1.identity.socket.emit("playerMove", data);
      targetObject.player2.identity.socket.emit("playerMove", data);

      if (winCheck(data).haveWon) {
        targetObject.player1.identity.socket.emit("winner", {
          winner: winCheck(data).winner,
          winGlow: winCheck(data).glow,
        });
        targetObject.player2.identity.socket.emit("winner", {
          winner: winCheck(data).winner,
          winGlow: winCheck(data).glow,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected: ", socket.id);

    let disconnectedPlayerPair = activePlayingPair.find((playerPair) => {
      return (
        playerPair.player1.identity.socket.id == socket.id ||
        playerPair.player2.identity.socket.id == socket.id
      );
    });

    if (disconnectedPlayerPair.player1.identity.socket.id == socket.id) {
      disconnectedPlayerPair.player1.identity.online = false;
      disconnectedPlayerPair.player2.identity.socket.emit(
        "opponentDisconnected"
      );
    } else {
      disconnectedPlayerPair.player2.identity.online = false;
      disconnectedPlayerPair.player1.identity.socket.emit(
        "opponentDisconnected"
      );
    }
  });
});

//Required Functions
function winCheck(arr) {
  //the glow parameter helps to glow squares at win condition at front End
  if (arr[0] == arr[1] && arr[1] == arr[2])
    return { haveWon: true, winner: arr[0], glow: [0, 1, 2] };
  else if (arr[3] == arr[4] && arr[4] == arr[5])
    return { haveWon: true, winner: arr[3], glow: [3, 4, 5] };
  else if (arr[6] == arr[7] && arr[7] == arr[8])
    return { haveWon: true, winner: arr[6], glow: [6, 7, 8] };
  else if (arr[0] == arr[3] && arr[3] == arr[6])
    return { haveWon: true, winner: arr[0], glow: [0, 3, 6] };
  else if (arr[1] == arr[4] && arr[4] == arr[7])
    return { haveWon: true, winner: arr[1], glow: [1, 4, 7] };
  else if (arr[2] == arr[5] && arr[5] == arr[8])
    return { haveWon: true, winner: arr[2], glow: [2, 5, 8] };
  else if (arr[0] == arr[4] && arr[4] == arr[8])
    return { haveWon: true, winner: arr[0], glow: [0, 4, 8] };
  else if (arr[2] == arr[4] && arr[4] == arr[6])
    return { haveWon: true, winner: arr[2], glow: [2, 4, 6] };
  else if (arr.filter((el) => typeof el != "number").length == 9)
    return { haveWon: true, winner: "draw", glow: [0, 1, 2, 3, 4, 5, 6, 7, 8] };
  else return { haveWon: false };
}

httpServer.listen(PORT, () => console.log("Server Started"));
