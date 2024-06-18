import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api":{
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }  
  },
  plugins: [react()],
  resolve: {
    alias: [
            { find: '@', replacement: path.resolve('./src/@/') },
            { find: '@/components', replacement: path.resolve('./src/@/components/') 
        },
            { find: '@/lib', replacement: path.resolve('./src/@/lib/') },
        ],
       
  },
})
