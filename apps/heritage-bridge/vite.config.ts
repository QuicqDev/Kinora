import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('../..', import.meta.url)), 'HERITAGE_');
  const port = Number(env.HERITAGE_PORT) || 5181;
  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5180,
      strictPort: true,
      proxy: { '/api': `http://127.0.0.1:${port}` },
      fs: { strict: true },
    },
    build: { sourcemap: false },
  };
});
