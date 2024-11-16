<script setup lang="ts">
import { provide, nextTick, ref } from 'vue';
import Header from './components/Header.vue';
import TopNav from './components/TopNav.vue';
import { useRoute } from 'vue-router';
import { getNewList } from './api/getWallpaler';
import { downloadWallpaper } from './utils/download';
import setWallpaper from './utils/setWallpaper';
const isRouterActive = ref(true)
const ipcRenderer = window.electron.ipcRenderer
const route = useRoute();

provide('reload',() => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})

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

ipcRenderer.on("dragLoaclImage",(_e,files) => {
  if(files.length === 1){
    if(files[0].slice(files[0].lastIndexOf('.') + 1,files[0].length).toLowerCase() === 'mp4'){
      ipcRenderer.invoke("setDynamicWin",files[0])
    }
  }
  // let img = ['jpg','png','jpeg']
  // let res = true
  // for(let i = 0; i < files.length; i++){
  //   if(!img.includes(files[i].slice(files[i].lastIndexOf('.') + 1,files[i].length).toLowerCase())){
  //     res = false
  //     break;
  //   }
  // }
  // if(res){

  // }else{

  // }
});
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