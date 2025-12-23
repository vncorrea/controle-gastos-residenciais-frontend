import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Plugin para otimizar react-icons
const optimizeReactIcons = () => {
  return {
    name: 'optimize-react-icons',
    resolveId(id) {
      // Força resolução específica para react-icons/fa
      if (id.startsWith('react-icons/fa/')) {
        return id
      }
      return null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), optimizeReactIcons()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Força imports específicos do react-icons para melhor tree-shaking
      'react-icons/fa': path.resolve(__dirname, './node_modules/react-icons/fa'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
      },
      format: {
        comments: false,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // react-icons PRIMEIRO - antes de qualquer outra verificação
          if (id.includes('react-icons')) {
            // Separa por tipo de ícone para melhor tree-shaking
            if (id.includes('react-icons/fa')) {
              return 'icons-fa';
            }
            return 'icons-other';
          }
          // Vendor chunks - agrupa por biblioteca
          if (id.includes('node_modules')) {
            // React e dependências relacionadas
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Sonner (toast notifications)
            if (id.includes('sonner')) {
              return 'ui-vendor';
            }
            // Axios
            if (id.includes('axios')) {
              return 'utils-vendor';
            }
            // Outros node_modules
            return 'vendor';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    cssMinify: true,
    reportCompressedSize: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Otimizações adicionais
    assetsInlineLimit: 4096, // Inline assets menores que 4kb
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['react-icons'],
    esbuildOptions: {
      treeShaking: true,
    },
  },
  esbuild: {
    treeShaking: true,
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
})
