// utils/socket.js
import { io } from 'socket.io-client';

const socket = io('https://seversecurity-production.up.railway.app', {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;