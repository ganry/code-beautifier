export default {
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: './index.html',
        app: './app.html',
      },
    },
  },
}
