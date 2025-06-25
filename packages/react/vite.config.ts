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
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "framer-motion",
        "react-virtuoso",
        "*.svg"
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
          "react/jsx-dev-runtime": "ReactJSXDevRuntime",
          "framer-motion": "FramerMotion",
          "react-virtuoso": "ReactVirtuoso",
        },
      },
    },
  },
})
