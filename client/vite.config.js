import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const originalWarn = console.warn;
console.warn = (msg, ...args) => {
  if (typeof msg === 'string' && msg.includes('ws proxy socket error')) return;
  originalWarn(msg, ...args);
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            if (err.code !== 'ECONNABORTED') {
              console.error('Proxy error:', err);
            }
          });
        },
      },
    },
  },
});
