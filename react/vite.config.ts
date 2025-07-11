import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {

        port: 5678,
        proxy: {
            '/api': {
                target: 'https://localhost:7195',
                changeOrigin: true,
                secure: false, 
            },
        },

    }
})
