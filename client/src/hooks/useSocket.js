import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useStore from '../store/appStore';
import mockData from '../services/mockData';

export default function useSocket() {
  const socketRef = useRef(null);
  const setStadium = useStore((s) => s.setStadium);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';
    const socket = io(SOCKET_URL, {
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

    const startMockTimer = () => {
      setStadium(mockData.stadiumUpdate);
      mockTimer = setInterval(() => {
        setStadium((prev) => {
          const base = mockData.stadiumUpdate;
          return {
            ...base,
            overallOccupancy: 65 + Math.floor(Math.random() * 25),
            gates: base.gates.map((g) => ({
              ...g,
              occupancy: Math.min(100, Math.max(20, g.occupancy + Math.floor(Math.random() * 12 - 6))),
            })),
            foodCourts: base.foodCourts.map((f) => ({
              ...f,
              queueTime: Math.max(1, Math.min(20, f.queueTime + Math.floor(Math.random() * 5 - 2))),
            })),
          };
        });
      }, 5000);
    };

    socket.on('connect_error', () => {
      if (!mockTimer) startMockTimer();
    });

    socket.on('error', () => {});

    setTimeout(() => {
      if (!socket.connected && !mockTimer) startMockTimer();
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
