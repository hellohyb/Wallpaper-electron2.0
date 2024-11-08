<script setup lang="ts">
import { onMounted, provide, nextTick, ref } from 'vue';
import Header from './components/Header.vue';
import TopNav from './components/TopNav.vue';
import { useRoute } from 'vue-router';
import { getNewList } from './api/getWallpaler';
import downloadWallpaper from './utils/download';
import setWallpaper from './utils/setWallpaper';
const isRouterActive = ref(true)
const ipcRenderer = window.electron.ipcRenderer
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
const route = useRoute();
// 监听菜单栏随机壁纸设置
ipcRenderer.on('getRandImgUrl',async (_e,msg) => {
  let imgUrl = (await getNewList(msg.pageNo,10)).data.data.list[msg.No].url
  let res = await downloadWallpaper(imgUrl)
  if(res){
    await setWallpaper(res)
  }
})
onMounted(() => {
  initFavorite()
  
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