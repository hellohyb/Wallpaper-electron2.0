<script lang="ts" setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { searchWallpaper } from '@renderer/api/getWallpaler';
import ImgBox from '@renderer/components/ImgBox.vue';
const wallpaperList:any = ref([])
const searchKey = ref('')
const showResult = ref(false)
const search = async() => {
    if(searchKey.value.trim() !== ''){
        wallpaperList.value = []
        wallpaperList.value = (await searchWallpaper(searchKey.value,1)).data.data
        showResult.value = true
    }else{
        ElMessage({type:"error",message:"搜索内容不能为空！"})
    }
}
</script>

<template>
    <div class="search">
        <div v-if="!showResult" class="search-info w-full h-full flex flex-col items-center justify-start">
            <div class="icon-text flex justify-center items-center mb-4">
                <svg t="1708596705433" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10294" id="mx_n_1708596705435" width="100" height="100"><path d="M742 626.5c-30.6 48.4-72.4 88.9-121.9 117.8l199 199L939 823.5l-197-197z" fill="#C0C3C6" p-id="10295"></path><path d="M441.1 809.8C235.6 809.8 68.3 642.6 68.3 437c0-205.6 167.2-372.8 372.8-372.8 205.6 0 372.8 167.2 372.8 372.8 0 205.6-167.2 372.8-372.8 372.8z m0-711.8c-186.9 0-339 152.1-339 339s152.1 339 339 339 339-152.1 339-339-152-339-339-339z" fill="#2E3742" p-id="10296"></path><path d="M819.1 960.2c-4.3 0-8.7-1.7-12-5l-199-199c-3.7-3.7-5.5-8.9-4.8-14.1 0.7-5.2 3.7-9.8 8.3-12.4 47-27.4 87.1-66.2 116.1-112.2 2.7-4.3 7.3-7.2 12.4-7.8 5-0.5 10.2 1.2 13.8 4.9l197 197c3.2 3.2 5 7.5 5 12s-1.8 8.8-5 12L831.1 955.3c-3.3 3.3-7.7 4.9-12 4.9z m-172-212.8l172 172 95.9-95.9L744.6 653c-26.5 37.1-59.7 69.2-97.5 94.4zM626.2 267.1c-4.7 0-9.4-1.9-12.7-5.8C505 137.4 348 213.8 346.4 214.6c-8.3 4.1-18.5 0.8-22.7-7.6-4.2-8.4-0.8-18.5 7.6-22.7 1.8-0.9 182.2-88.8 307.7 54.7 6.1 7 5.4 17.7-1.6 23.9-3.3 2.8-7.2 4.2-11.2 4.2z" fill="#2E3742" p-id="10297"></path></svg>
                <span class="text-[40px] font-semibold">搜索壁纸</span>
            </div>
            <div class="search-bar flex rounded-md h-[40px]">
                <input v-model="searchKey" type="text"
                 class="flex-1 text-[16px] bg-transparent px-2" 
                 style="height: 100%;outline: none;border: none;"
                 placeholder="请输入壁纸关键字"
                 @keydown.enter="search()"
                 >
                <el-button type="primary" style="height: 100%;" :icon="Search" @click="search()">搜索</el-button>
            </div>
        </div>

        <div v-if="showResult" class="search-result flex flex-col">
            <div class="top-search flex justify-center py-2">
                <el-input @keydown.enter="search()" style="width: 80%;" v-model="searchKey" placeholder="请输入壁纸关键字">
                    <template #prefix>
                        <el-icon @click="search()" class="el-input__icon cursor-pointer"><Search /></el-icon>
                    </template>
                </el-input>
            </div>
            <div class="result-main pt-2 flex justify-center flex-wrap">
                <ImgBox v-for="item in wallpaperList.list" :imgInfo="item"/>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.search{
    width: 100%;
    box-sizing: border-box;
    .search-info{
        width: 100%;
        height: 100%;
        margin-top: 100px;
        .icon-text{
            background-image: linear-gradient(60deg, #00ff2a, #0072fe);
            background-clip: text;
            color: transparent;
        }
        .search-bar{
            width: 50%;
            border: 1px solid #409eff;
        }
    }
    .search-result{
        width: 100%;
        height: 100%;
        .result-main{
            width: 100%;
            height: calc(100vh - 180px);
            overflow-y: scroll;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
    
}
</style>