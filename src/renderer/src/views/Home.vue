<script lang="ts" setup>
import { getBingWallpaper, getNewList } from '@renderer/api/getWallpaler';
import { onMounted, ref } from 'vue';
const bingWallpaperList:any = ref([])
const newWallpaper:any = ref([])
const showView = ref(false)
const imgInfo = ref([])
const openViewImg = (item) => {
    imgInfo.value = item
    showView.value = true
}
onMounted(async() => {
    newWallpaper.value = (await getNewList(1,5)).data.data
    let oldBingWallpaper:any = await (await getBingWallpaper(8)).data.images
    oldBingWallpaper.forEach((item) => {
        bingWallpaperList.value.push({
            url:`http://cn.bing.com${item.url.slice(0,item.url.indexOf('&'))}`,
            tag:item.copyright,
            id:Date.now()+Math.random()*(10000-99999)+99999
        })
    })
})
</script>

<template>
    <div class="home">
        <div class="top-item w-[100%] h-[100%] overflow-hidden">
            <p class="m-0 mb-1 colorful-text">每日壁纸</p>
            <div class="swiper-box w-[100%] h-[70%] flex">
                <div class="swiper w-[75%] h-[100%] bg-white rounded-md overflow-hidden">
                    <el-carousel :interval="4000" style="height: 100%;">
                        <el-carousel-item style="width: 100%;height: 100%;" v-for="item in bingWallpaperList.slice(0,5)" :key="item">
                            <img @click="openViewImg(item)" :src="item.url" style="width: 100%;height: 100%;cursor: pointer;" alt="">
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="right-list ml-4 flex-1 flex flex-col justify-between items-center">
                    <div
                    class="img-item rounded-md" 
                    v-for="item in bingWallpaperList.slice(5,8)" 
                    style="width: 95%;max-height: calc(100% / 3.1);overflow: hidden;">
                        <img  
                        :src="item.url" 
                        style="width: 100%;height: 100%;"
                        class="rounded-md cursor-pointer"
                        @click="openViewImg(item)"
                        alt="">
                    </div>
                </div>
            </div>
            <p class="m-0 mb-1 text-sm mt-1 flex justify-between">
                <span class="colorful-text">最新壁纸</span>
                <span class="cursor-pointer text-[#409EFF]" @click="$router.push('/wallpaper')">更多壁纸</span>
            </p>
            <div class="w-[100%] h-[20%] grid grid-cols-5 grid-rows-1 gap-2 overflow-hidden">
                <div
                    class="img-item rounded-md"     
                    v-for="item in newWallpaper.list"
                    style="width: 100%;height: 100%;overflow: hidden;">
                    <img 
                        style="width: 100%;height: 100%;cursor: pointer;"
                        :src="item.url"
                        @click="openViewImg(item)"
                        alt=""
                    >
                </div>
                
            </div>
        </div>
       
        <ViewImg v-model:showView="showView" :imgInfo="imgInfo"/>
    </div>
</template>

<style lang="less" scoped>
:deep(.el-carousel__container){
    height: 100%;
}
.home{
    width: 100%;
    height: calc(100vh - 83px);
    padding: 10px 20px;
    box-sizing: border-box;
    user-select: none;
    .img-item{
        img{
            transition: all .5s;
            &:hover{
                transform: scale(1.5);
            }
        }
    }
}
</style>