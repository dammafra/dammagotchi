import tailwindcss from '@tailwindcss/vite'
import restart from 'vite-plugin-restart'

export default {
  root: 'html2png/',
  publicDir: '../static/',
  base: './',
  server: {
    port: 5174,
  },
  build: {
    outDir: '../dist/html2png', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    tailwindcss(),
    restart({ restart: ['../static/**'] }), // Restart server on static file change
  ],
}
