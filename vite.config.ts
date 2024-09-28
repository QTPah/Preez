import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your API server
        changeOrigin: true,              // Changes the origin of the host header to the target URL
      }
    }
  }
});
