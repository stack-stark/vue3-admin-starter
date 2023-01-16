import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import ViteComponents from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import legacy from '@vitejs/plugin-legacy'

const plugins: PluginOption[] = [
  vue(),
  ViteComponents({
    resolvers: [AntDesignVueResolver()],
  }),
  legacy({
    targets:['chrome 52'],  // 需要兼容的目标列表，可以设置多个
  }),
]

if (process.env.VITE_BUILD === 'STATS') {
  plugins.push(visualizer({ open: true }))
}

export default defineConfig({
  plugins: plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  build: {
    rollupOptions: {
      output: {
          // 去掉注释内容
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

  },
})
