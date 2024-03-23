import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    server:{
      proxy:{
        "/api":{
          target:"http://wp.birdpaper.com.cn/intf/",
          changeOrigin:true,
          rewrite:path => path.replace(/^\/api/,'')
        },
        
        "/bing":{
          target:"https://cn.bing.com/",
          changeOrigin:true,
          rewrite:path => path.replace(/^\/bing/,'')
        }
      }
    }
  }
})
