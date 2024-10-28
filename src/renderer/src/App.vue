<script setup lang="ts">
import { onMounted, provide, nextTick, ref } from 'vue';
import Header from './components/Header.vue';
import TopNav from './components/TopNav.vue';
import { useRoute } from 'vue-router';
const isRouterActive = ref(true)
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