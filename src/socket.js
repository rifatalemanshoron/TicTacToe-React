import { io } from 'socket.io-client';

export const socket = io('https://tictactoe-react-7v1d.onrender.com', {autoConnect: false})