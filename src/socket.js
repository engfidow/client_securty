// socket.js
import { io } from 'socket.io-client';

const socket = io('https://security991.onrender.com', {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

export default socket;
