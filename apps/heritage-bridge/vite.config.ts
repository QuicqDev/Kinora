import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env =
    mode === 'static-demo'
      ? {}
      : loadEnv(mode, fileURLToPath(new URL('../..', import.meta.url)), 'HERITAGE_');
  const port = Number(env.HERITAGE_PORT) || 5181;
  return {
    define: { __KINORA_STATIC_DEMO__: mode === 'static-demo' },
    base: mode === 'static-demo' ? '/Kinora/' : '/',
    plugins: [
      react(),
      {
        name: 'static-demo-csp',
        transformIndexHtml(html) {
          return mode === 'static-demo'
            ? html.replace(
                '<head>',
                `<head><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'">`,
              )
            : html;
        },
      },
    ],
    server: {
      host: '127.0.0.1',
      port: 5180,
      strictPort: true,
      proxy: { '/api': `http://127.0.0.1:${port}` },
      fs: { strict: true },
    },
    build: { sourcemap: false, modulePreload: { polyfill: false } },
  };
});
