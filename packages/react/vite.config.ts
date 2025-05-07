import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({
    rollupTypes: true,
    include: ['./lib/**/*.(ts|tsx)'],
    tsconfigPath: './tsconfig.app.json',
    entryRoot: './lib',
  })],
  build: {
    emitAssets: true,
    lib: {
      name: 'chat-conversation-react',
      entry: './lib/index.ts',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "*.svg"],
      output: {
        globals: {
          react: "react",
          "react-dom": "react-dom",
        },
      },
    },
  },
})
