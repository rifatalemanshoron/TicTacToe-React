# 🕹️ Enhanced Tic-Tac-Toe using React, NodeJs, Socket.io

This project is an enhanced version of a Tic-Tac-Toe game built using React, Node.js, and Socket.IO. The original tutorial was created by [ArrayofSilicon](https://www.youtube.com/watch?v=wKclQPsvPS0). This version includes several improvements and additional features to enhance the gameplay experience.

## 📑 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## ✨ Features

- **Simplified State Management**: Reduced the complexity of state management by using a 1D array instead of a 2D array for move information.
- **Multi-Player Support**: The game now supports more than two players simultaneously on the server.
- **UI Enhancements**:
  - 🖱️ Square hover effect: Visual feedback when hovering over squares.
  - 🔄 Improved move switching toggle: Clearly indicates which player's turn it is.
  - 🟥 Enhanced square disabling: Unclickable buttons are shown in red.
  - 🎉 Winning glow effect: A better visual effect when a player wins, controlled from the backend.
- **Backend Logic**: Winning logic is handled on the backend to ensure a single source of truth.

## 🛠️ Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/TicTacToe-React.git
   cd TicTacToe-React
   ```

2. Install dependencies for the server:
   ```sh
   cd server
   npm install
   ```

3. Install dependencies for the client:
   ```sh
   cd ../client
   npm install
   ```

## 🚀 Usage

1. Start the server:
   ```sh
   cd server
   npm start
   ```

2. Start the client:
   ```sh
   cd ../client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to start playing the game.

## 🙏 Credits

This project is based on the [ArrayofSilicon](https://www.youtube.com/watch?v=wKclQPsvPS0). Many thanks to ArrayofSilicon for the excellent tutorial and inspiration.

## 📜 License

This project is free to use.
