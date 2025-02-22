import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import glsl from 'vite-plugin-glsl'
import restart from 'vite-plugin-restart'

export default {
  root: 'src/',
  publicDir: '../static/',
  base: './',
  server: {
    host: true, // Open to local network and display URL
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: '../dist', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    tailwindcss(),
    restart({ restart: ['../static/**'] }), // Restart server on static file change
    glsl(),
  ],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, 'src/experience/config'),
      '@device': path.resolve(__dirname, 'src/experience/device'),
      '@experience': path.resolve(__dirname, 'src/experience/experience.js'),
      '@life': path.resolve(__dirname, 'src/experience/life'),
      '@screen': path.resolve(__dirname, 'src/experience/screen'),
      '@shaders': path.resolve(__dirname, 'src/shaders'),
      '@ui': path.resolve(__dirname, 'src/experience/ui'),
      '@utils': path.resolve(__dirname, 'src/experience/utils'),
    },
  },
}
