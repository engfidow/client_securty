// utils/socket.js
import { io } from 'socket.io-client';

const socket = io('https://security991.onrender.com', {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;