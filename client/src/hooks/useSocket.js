import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/appStore';

export default function useSocket() {
  const socketRef = useRef(null);
  const setStadium = useStore((s) => s.setStadium);

  useEffect(() => {
    const socket = io('/', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('stadium:update', (data) => {
      setStadium(data);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.off('stadium:update');
      socket.off('connect_error');
      socket.off('error');
      socket.disconnect();
    };
  }, [setStadium]);

  return socketRef.current;
}
