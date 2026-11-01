import { defineConfig } from 'vite';

// Dev harness: `npm run dev` then open http://localhost:5173/dev/index.html
export default defineConfig({ server: { port: 5173, host: '127.0.0.1' } });
