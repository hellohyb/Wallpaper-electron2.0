<script lang="ts" setup>
import { downloadWallpaper } from '@renderer/utils/download';
import setWallpaper from '@renderer/utils/setWallpaper';
import { addFavorite, isFavorited, delFavorite, addCategory } from '@renderer/utils/favorite/setFavorite'
import { ref } from 'vue';
import { getCategory } from '@renderer/utils/favorite/getFavorite';
const props = defineProps({
    showView:Boolean,
    imgInfo:Object
})

const emit = defineEmits(['update:showView'])
const closeView = () => {
    emit('update:showView',false)
}
const downloading = ref(false)
// 设置壁纸
const setPaper = async(imgInfos) => {
    let imgUrl = imgInfos.url
    downloading.value = true
    let res = imgInfos.local ? imgInfos.url : await downloadThisImg(imgUrl)
    if(res){
        if(await setWallpaper(res)){
            ElMessage({message:"设置成功！",type:"success"})
        }else{
            ElMessage({message:"设置失败！",type:"error"})
        }
    }
    else{
        ElMessage({message:"设置失败！",type:"error"})
    }
    downloading.value = false
}
const donwloadDir = ref(JSON.parse(localStorage.getItem('config') as any).downloadPath || null)
// 下载壁纸
const downloadThisImg = async(imgUrl) => {
    let res = await downloadWallpaper(imgUrl,donwloadDir.value)
    if(res){ 
        ElMessage({message:"下载成功！",type:"success"})
    }
    else{
        ElMessage({message:"下载失败！",type:"error"})
    }
    return res
}

// 收藏（点击收藏，弹出选择收藏夹节面）
const beforeSetFavorite = (imgInfo) => {
    if(addFavorite(imgInfo,nowCategory.value)){
        ElMessage({message:"收藏成功！",type:"success"})
    }
    showSelectFavorite.value = false
}

// 显示收藏夹弹窗：
const showSelectFavorite = ref(false)
// 获取总的收藏夹
const categoryList = ref(getCategory())
// 当前选择的收藏夹
const nowCategory = ref('默认收藏')
// 新建收藏夹部分：

// 输入的收藏夹名
const favoriteCategoryName = ref('')
// 显示对话框
const centerDialogVisible = ref(false)
// 新建收藏夹
const addFavoriteCategory = () => {
   if(favoriteCategoryName.value.trim() == ''){
    ElMessage({message:"文件夹名不能为空！",type:"error"})
   }else{
        if(addCategory(favoriteCategoryName.value)){
            ElMessage({message:"创建成功！",type:"success"})
        }else{
            ElMessage({message:"该收藏夹名已存在，请重新输入！",type:"error"})
        }
   }
}
</script>

<template>
    <div class="viewImg">
        <!-- 显示图片，信息，下载，收藏，设为壁纸功能 -->
        <el-dialog
            :model-value="props.showView"
            width="80%"
            :before-close="closeView"
            align-center
            style="height: auto;"
            :show-close="false"
        >
        <img :src="props.imgInfo?.url" style="width: 100%;height: auto;border-radius: 5px;" alt="">
        <div class="w-full my-2 flex justify-center items-center">{{ props.imgInfo!.tag }}</div>
        <div class="tools w-full h-[74px] flex justify-around items-center">
            <!-- 收藏 -->
            <div v-if="!isFavorited(props.imgInfo)" @click="showSelectFavorite = true" class="icons w-[80px] h-[80px] flex flex-col justify-center items-center">
                <svg t="1708601479458" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14835" width="40" height="40"><path d="M614.4 288c-21.888 0-47.36 12.8-71.68 27.008L512 332.8l-30.72-17.92c-24.32-13.952-49.792-27.008-71.68-27.008A143.36 143.36 0 0 0 300.928 524.8L512 750.976 723.072 524.8A143.36 143.36 0 0 0 614.4 288z" fill="#2c2c2c" p-id="14836"></path><path d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m256.768 565.888L512 840.96 255.232 565.888A204.8 204.8 0 0 1 409.6 226.56c37.376 0 72.32 17.92 102.4 35.328 30.08-17.408 65.024-35.328 102.4-35.328a204.8 204.8 0 0 1 154.368 339.328z" fill="#2c2c2c" p-id="14837"></path></svg>
                <span class="mt-1">收藏</span>
            </div>
            <div v-else @click="delFavorite(props.imgInfo)" class="icons icons-active w-[80px] h-[80px] flex flex-col justify-center items-center">
                <svg t="1708601479458" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14835" width="40" height="40"><path d="M614.4 288c-21.888 0-47.36 12.8-71.68 27.008L512 332.8l-30.72-17.92c-24.32-13.952-49.792-27.008-71.68-27.008A143.36 143.36 0 0 0 300.928 524.8L512 750.976 723.072 524.8A143.36 143.36 0 0 0 614.4 288z" fill="#2c2c2c" p-id="14836"></path><path d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m256.768 565.888L512 840.96 255.232 565.888A204.8 204.8 0 0 1 409.6 226.56c37.376 0 72.32 17.92 102.4 35.328 30.08-17.408 65.024-35.328 102.4-35.328a204.8 204.8 0 0 1 154.368 339.328z" fill="#2c2c2c" p-id="14837"></path></svg>
                <span class="mt-1">已收藏</span>
            </div>
            <!-- 下载 -->
            <div v-if="!props.imgInfo!.local" @click="downloadThisImg(props.imgInfo!.url)" class="icons w-[80px] h-[80px] flex flex-col justify-center items-center">
                <svg t="1708601249467" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13704" width="40" height="40"><path d="M892.5 879.2h-761c-18.4 0-33.3-14.9-33.3-33.3V679.5c0-18.4 14.9-33.3 33.3-33.3h30c18.4 0 33.3 14.9 33.3 33.3 0 4.5-0.9 8.9-2.6 12.8l-13 64.8c0 18.4 14.9 33.3 33.3 33.3h599c18.4 0 33.3-14.9 33.3-33.3l-13-64.8c-1.7-3.9-2.6-8.3-2.6-12.8 0-18.4 14.9-33.3 33.3-33.3h30c18.4 0 33.3 14.9 33.3 33.3v166.4c0 18.4-14.9 33.3-33.3 33.3z m-66.6-500.3v0.6c2.6 1.1 4.4 3.7 4.4 6.7s-1.8 5.6-4.4 6.7v0.4L520.7 706.1h-0.4c-1.1 2.6-3.7 4.4-6.7 4.4s-5.6-1.8-6.7-4.4h-0.4L201.4 393.2v-0.4c-2.6-1.1-4.4-3.7-4.4-6.7s1.8-5.6 4.4-6.7v-0.6h-13.9 207v-51c0-18.4 14.9-33.3 33.3-33.3h168.6c18.4 0 33.3 14.9 33.3 33.3v51H840h-14.1z m-224-115.4H422.1c-15.3 0-27.7-12.4-27.7-27.7s12.4-27.7 27.7-27.7h179.7c15.3 0 27.7 12.4 27.7 27.7s-12.3 27.7-27.6 27.7z m11-84.3H411.1c-9.2 0-16.6-7.5-16.6-16.6 0-9.2 7.5-16.6 16.6-16.6H613c9.2 0 16.6 7.5 16.6 16.6 0 9.2-7.5 16.6-16.7 16.6z" fill="#2c2c2c" p-id="13705"></path></svg>
                <span class="mt-1">下载</span>
            </div>

            <!-- 设为壁纸 -->
            <el-button v-if="!downloading" type="success" class="rounded-[5px]" size="large" @click="setPaper(props.imgInfo)">设为壁纸</el-button>
            <el-button v-else loading type="success" class="rounded-[5px]" size="large">下载中</el-button>
        </div>
        </el-dialog>
        <!-- 点击收藏时，显示选择收藏夹弹窗 -->

        <el-dialog
            v-model="showSelectFavorite"
            title="选择收藏夹"
            width="500"
            align-center
        >
            <el-select
                v-model="nowCategory"
                class="m-2"
                placeholder="Select"
                size="default"
                style="width: 80%;"
            >
        <el-option
        v-for="item in categoryList"
        :key="item"
        :label="item"
        :value="item"
        />
    </el-select>
            <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="beforeSetFavorite(props.imgInfo)">确定</el-button>
                <el-button  @click="showSelectFavorite = false">取消</el-button>
            </div>
            </template>
        </el-dialog>


        <!-- 显示新建收藏夹 -->
        <el-dialog v-model="centerDialogVisible" title="新建收藏夹" width="500" align-center>
        <el-input v-model="favoriteCategoryName" type="text" placeholder="请输入收藏夹名" />
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addFavoriteCategory()">
                创建
                </el-button>
            </div>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="less" scoped>
:deep(.el-dialog){
    border-radius: 5px;
}
.icons{
    &:hover{
        cursor: pointer;
        color:#409EFF;
        svg{
            path{
                fill: #409EFF;
            }
        }
    }
}
.icons-active{
    color:red;
    svg{
        path{
            fill: red;
        }
    }
}
</style>