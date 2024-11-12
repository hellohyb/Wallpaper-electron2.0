<script setup lang="ts">
import { onMounted, provide, nextTick, ref } from 'vue';
import Header from './components/Header.vue';
import TopNav from './components/TopNav.vue';
import { useRoute } from 'vue-router';
import { getNewList } from './api/getWallpaler';
import { downloadWallpaper, mkdirsSync } from './utils/download';
import setWallpaper from './utils/setWallpaper';
import getDefaultDirectory from './utils/getDefaultDirectory';
const isRouterActive = ref(true)
const ipcRenderer = window.electron.ipcRenderer
const route = useRoute();
provide('reload',() => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
// 初始化收藏列表
const initFavorite = () => {
  let getFavorite = JSON.parse(localStorage.getItem('favorite') as any) || false
  if(!getFavorite || getFavorite.length == 0){
    localStorage.setItem('favorite',JSON.stringify([{categoryName:'默认收藏',imgList:[]}]))
  }
}
// 初始化缓存目录，下载目录
const initDefaultDir = async () => {
  const paths = await getDefaultDirectory()
  mkdirsSync(paths)
}

// 监听菜单栏随机壁纸设置(壁纸库)
ipcRenderer.on('getRandImgUrl',async (_e,msg) => {
  let imgUrl = (await getNewList(msg.pageNo,10)).data.data.list[msg.No].url
  let res = await downloadWallpaper(imgUrl)
  if(res){
    await setWallpaper(res)
  }
})
// 监听菜单栏轮播壁纸设置(收藏夹)
ipcRenderer.on('setWallpaperByFavorite',async(_e,filePath) => {
  let res = filePath.slice(0,4) === 'file' ? filePath : await downloadWallpaper(filePath)
  if(res){
    await setWallpaper(res)
  }
})
// 监听菜单栏轮播壁纸设置(本地目录)
ipcRenderer.on('setWallpaperByLocal',async(_e,filePath) => {
  if(filePath){
    await setWallpaper(filePath)
  }
})
// 初始化设置项
const initSettingConfig = async () => {
  const config = {
    downloadPath: await getDefaultDirectory(), // 下载地址
    cachePath: await getDefaultDirectory(), // 缓存地址
    player:{
      no:1,           // 1壁纸库随机，2收藏夹， 3本地目录
      localPath:'',   // 本地目录路径
      favoriteName:'默认收藏',    //  收藏夹名
      order:1,        // 1顺序，0随机
      changeTime: 10, // 壁纸切换间隔
    },
    closeWindow: 0, // 关闭窗口时：1:最小化，0:直接退出
    start: false, // 开机是否启动应用
    GPU: false
  }
  localStorage.setItem("config",JSON.stringify(config))
}
// 获取localstorage
const sendLocalStorage = () => {
  ipcRenderer.send("send-config",{
    config:JSON.parse(localStorage.getItem('config') as any),
    favoriteList:JSON.parse(localStorage.getItem('favorite') as any)
  })
}
onMounted(async () => {
  initFavorite()
  await initDefaultDir()
  if(!localStorage.getItem("config")){
    await initSettingConfig()
  }
  sendLocalStorage()
})
</script>

<template>
  <Header></Header>
  <div class="content">
    <TopNav v-if="route.path !== '/video'"/>
    <router-view v-if="isRouterActive" v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"></component>
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive"></component>
    </router-view>
  </div>
</template>
<style scoped>
.content{
  width: 100%;
  height: calc(100% - 30px);
  box-sizing: border-box;
}
</style>