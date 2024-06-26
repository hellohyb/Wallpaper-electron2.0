<script lang="ts" setup>
import { getCategory, getImgListByCategory } from '@renderer/utils/favorite/getFavorite';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { inject } from 'vue';
import ImgBox from '@renderer/components/ImgBox.vue';
import { addCategory, cleanFavorite, delCategory } from '@renderer/utils/favorite/setFavorite';
// 获取总的收藏夹
const categoryList = ref(getCategory())
// 当前收藏夹名
const activeList = ref('默认收藏')
// 当前图片列表
const imgList = ref(getImgListByCategory(activeList.value))
// 更换收藏夹
const changeCategory = (categoryName) => {
    activeList.value = categoryName
    imgList.value = getImgListByCategory(activeList.value)
}
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
// 输入的收藏级名
const favoriteCategoryName = ref('')
// 显示对话框
const centerDialogVisible = ref(false)

// 左侧分类右键事件
const showContextmenu = ref(false)  // 显示右键菜单
const dialogVisible = ref(false) // 显示确认是否删除框
const liDom = ref() // 获取收藏夹列表的Dom
const menuDom = ref() // 右键菜单的dom
const liDomInnerText = ref() // 当前选中的收藏夹的innerText
// 点击右键
const showMenu = (e,index) => { 
    showContextmenu.value = true
    menuDom.value.style.top = `${e.clientY - 70}px`
    menuDom.value.style.left = `${e.clientX}px`
    liDomInnerText.value = liDom.value[index].innerText;
}
// 右键删除事件
const delFavoriteCategory = () => {
    delCategory(liDomInnerText.value)
    dialogVisible.value = false
    ElMessage({type:"success",message:"删除成功！"})
}
const cleanFavoriteImg = () => {
    cleanFavorite(liDomInnerText.value)
    ElMessage({type:"success",message:`收藏夹 ${liDomInnerText.value} 已清空`})
}
// 监听右键菜单
watch(() => showContextmenu.value,() => {
    if(showContextmenu.value){
        document.addEventListener('click',() => {
            showContextmenu.value = false
        })
    }
})
// 取消收藏刷新
const reload:any = inject("reload")
const router = useRouter()
onMounted(() => {
  window.addEventListener('setItemEvent', () => {
    imgList.value = getImgListByCategory(activeList.value)
    categoryList.value = getCategory()
    if(router.currentRoute.value.path === '/favorite'){
        reload()
    }
    
  })  
})
</script>

<template>
    <div class="favorite flex">
       <div class="left-menu h-[100%] w-[130px] relative">
        <ul class="h-[100%] w-[100%] !pl-0 flex justify-start items-center flex-col ">
            <li 
                v-for="(item,index) in categoryList" 
                :key="`cate-${index}`"
                class="list-items hover:btn-active cursor-pointer w-[90%] flex justify-start items-center mb-2 py-1 rounded-md overflow-hidden"
                @click="changeCategory(item)"
                :class="{'btn-active':item == activeList}"
                @contextmenu="showMenu($event,index)"
                ref="liDom"
                >
                <svg t="1708684008279" class="icon ml-4 mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13147" width="16" height="16"><path d="M960 256H557.25L448 146.75A63.58 63.58 0 0 0 402.75 128H128a64.07 64.07 0 0 0-64 64v640a64.07 64.07 0 0 0 64 64h832a64.07 64.07 0 0 0 64-64V320a64.07 64.07 0 0 0-64-64z m0 576H128V192h274.75L512 301.26A63.61 63.61 0 0 0 557.25 320H960zM484.92 448A101 101 0 0 0 384 548.92c0 55.8 23.69 84.84 140.8 172.68a32 32 0 0 0 38.4 0C680.31 633.76 704 604.72 704 548.92a100.83 100.83 0 0 0-160-81.73A101.3 101.3 0 0 0 484.92 448z m86.49 81.92a36.93 36.93 0 0 1 68.59 19c0 20.59 0 33.49-96 106.94-96-73.45-96-86.35-96-106.94a36.93 36.93 0 0 1 68.59-19 32 32 0 0 0 54.82 0z" fill="#515151" p-id="13148"></path></svg>
                <span class="text-sm flex-1 text-ellipsis">{{ item }}</span>
                <!-- 右键菜单 -->
            </li>
            <div v-show="showContextmenu" ref="menuDom" class="contextmenu w-[100px] py-1 rounded-md absolute">
                <li @click="cleanFavoriteImg()" class="w-full py-1 text-center cursor-pointer hover:btn-active">清空图片</li>
                <li v-if="liDomInnerText !== '默认收藏'" @click="dialogVisible = true" class="w-full py-1 text-center cursor-pointer !text-[red] hover:btn-active">删除收藏夹</li>
            </div>
            <!-- 删除前确认框 -->
            <el-dialog
                v-model="dialogVisible"
                title="提示"
                width="35%"
                align-center
            >
                <span class="inline-block w-full text-center">是否删除 <b>{{ liDomInnerText }}</b> 及其包含的所有图片？</span>
                <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="delFavoriteCategory()">
                    确定
                    </el-button>
                </div>
                </template>
            </el-dialog>
        </ul>    
            <div @click="centerDialogVisible = true" class="addCategory flex justify-center items-center w-[100%] py-2 rounded-md bg-white hover:btn-active cursor-pointer absolute -bottom-3 left-0">
                <svg t="1708681062719" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7376" width="24" height="24"><path d="M492.16 213.333333H853.333333a128 128 0 0 1 128 128v469.333334a128 128 0 0 1-128 128H170.666667a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h213.333333a42.666667 42.666667 0 0 1 35.498667 18.986667L492.16 213.333333z m-130.986667-42.666666H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v597.333334a42.666667 42.666667 0 0 0 42.666667 42.666666h682.666666a42.666667 42.666667 0 0 0 42.666667-42.666666V341.333333a42.666667 42.666667 0 0 0-42.666667-42.666666h-384a42.666667 42.666667 0 0 1-35.498666-18.986667L361.173333 170.666667z" fill="#515151" p-id="7377"></path><path d="M512 420.992a42.666667 42.666667 0 0 1 42.666667 42.666667v85.333333h85.333333a42.666667 42.666667 0 0 1 42.368 37.674667l0.298667 4.992a42.666667 42.666667 0 0 1-42.666667 42.666666h-85.333333v85.333334a42.666667 42.666667 0 0 1-37.674667 42.368l-4.992 0.298666a42.666667 42.666667 0 0 1-42.666667-42.666666v-85.333334H384a42.666667 42.666667 0 0 1-42.368-37.674666L341.333333 591.658667a42.666667 42.666667 0 0 1 42.666667-42.666667h85.333333v-85.333333a42.666667 42.666667 0 0 1 37.674667-42.368L512 420.992z" fill="#515151" p-id="7378"></path></svg>
                <span class="text-sm ml-2">新建收藏夹</span>
            </div>
       </div>
        <div v-if="imgList.length > 0" class="right-img flex-1 px-2 py-2 flex flex-wrap">
            <ImgBox v-for="item in imgList" :imgInfo="item"/>
        </div>
        <div v-else class="right-img flex-1 px-2 py-2 flex justify-center items-center flex-col">
            <svg t="1708757696801" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7947" width="100" height="100"><path d="M896 722.944a25.6 25.6 0 0 1 51.2 0V819.2a76.8 76.8 0 0 1-76.8 76.8H153.6A76.8 76.8 0 0 1 76.8 819.2V256A76.8 76.8 0 0 1 153.6 179.2h716.8A76.8 76.8 0 0 1 947.2 256v288.8704a25.6 25.6 0 0 1-51.2 0V256a25.6 25.6 0 0 0-25.6-25.6H153.6a25.6 25.6 0 0 0-25.6 25.6v563.2a25.6 25.6 0 0 0 25.6 25.6h716.8a25.6 25.6 0 0 0 25.6-25.6v-96.256z m-438.784-43.2128l-93.9008-77.1584-138.1888 180.9408a25.6 25.6 0 1 1-40.6528-31.0272l141.4144-185.2416a46.08 46.08 0 0 1 65.8432-7.6288l94.208 77.4656 153.9072-170.2912a46.08 46.08 0 0 1 76.1344 11.8784l126.5152 278.7328a25.6 25.6 0 0 1-46.592 21.1968L672.6144 506.88l-151.9104 168.0896a46.08 46.08 0 0 1-63.488 4.7104zM358.4 486.4a76.8 76.8 0 1 1 0-153.6 76.8 76.8 0 0 1 0 153.6z m0-51.2a25.6 25.6 0 1 0 0-51.2 25.6 25.6 0 0 0 0 51.2z" fill="#9DA7B2" p-id="7948"></path></svg>
            <span class="text-[#bfbfbf]">暂未添加壁纸</span>
        </div>
    </div>
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
</template>

<style lang="less" scoped>
.contextmenu{
    box-shadow: 0 0 0 1px rgb(210, 210, 210);
    font-size: 12px;
    background-color: #fff;
}
.favorite{
    width: 100%;
    height: calc(100vh - 100px);
    .left-menu{
        border-right: 1px solid rgb(240, 240, 240);
        li{
            list-style: none;
        }
        ul{
            overflow-y: scroll;
            &::-webkit-scrollbar {
                display: none; /* Chrome Safari */
            }
        }
        
    }
}
</style>