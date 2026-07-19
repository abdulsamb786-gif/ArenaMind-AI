import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/appStore';
import mockData from '../services/mockData';

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

    let mockTimer;

    socket.on('stadium:update', (data) => {
      setStadium(data);
    });

    socket.on('connect_error', () => {
      if (!mockTimer) {
        setStadium(mockData.stadiumUpdate);
        mockTimer = setInterval(() => {
          setStadium({ ...mockData.stadiumUpdate, overallOccupancy: 70 + Math.floor(Math.random() * 10) });
        }, 5000);
      }
    });

    socket.on('error', () => {});

    setTimeout(() => {
      if (!socket.connected) {
        setStadium(mockData.stadiumUpdate);
        if (!mockTimer) {
          mockTimer = setInterval(() => {
            setStadium({ ...mockData.stadiumUpdate, overallOccupancy: 70 + Math.floor(Math.random() * 10) });
          }, 5000);
        }
      }
    }, 2000);

    socketRef.current = socket;

    return () => {
      socket.off('stadium:update');
      socket.off('connect_error');
      socket.off('error');
      socket.disconnect();
      if (mockTimer) clearInterval(mockTimer);
    };
  }, [setStadium]);

  return socketRef.current;
}
