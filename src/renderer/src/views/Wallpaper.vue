<script lang="ts" setup>
import { getCategory, getListByCategory } from '@renderer/api/getWallpaler';
import ViewImg from '@renderer/components/ViewImg.vue';
import { onMounted,ref,type Ref } from 'vue';
const categoryList:Ref<any> = ref([])
const categoryId:Ref<number> = ref(36)
const imageList:Ref<any> = ref([])
const total = ref(1)
const electronStore = window.electronStore
// 切换分类
const changeCategory = async(id) => {
    imageList.value = []
    categoryId.value = parseInt(id)
    imageList.value = await (await getListByCategory(id,1,20)).data.data 
    total.value = imageList.value.total_count
    // 收缩菜单
    if(categoryListDom.value.getAttribute('nowState') == 'show'){
        categoryListDom.value.classList.remove("!max-h-[500px]","transition-all","duration-500")
        more.value.innerText = '展开更多'
        categoryListDom.value.setAttribute('nowState','hidden')
    }
}

// 分类菜单Dom
const categoryListDom = ref()
const more = ref()
const showMore = () => { 
    if(categoryListDom.value.getAttribute('nowState') == 'hidden'){
        categoryListDom.value.classList.add("!max-h-[500px]","transition-all","duration-500")
        more.value.innerText = '收起'
        categoryListDom.value.setAttribute('nowState','show')
    }else{
        categoryListDom.value.classList.remove("!max-h-[500px]","transition-all","duration-500")
        more.value.innerText = '展开更多'
        categoryListDom.value.setAttribute('nowState','hidden')
    }
}

// 切换页数
const handleCurrentChange = async(val: number) => {
    imageList.value = []
    imageList.value = await (await getListByCategory(categoryId.value,val,20)).data.data
}
// 打开图片详情
const openViewImg = (imgInfos) => {
    imgInfo.value = imgInfos
    showView.value = true
}
const showView:Ref<boolean> = ref(false)
const imgInfo:Ref<Object> = ref({})
onMounted(async() => {
    // 获取分类
    if(!electronStore.get('categoryList') || electronStore.get('categoryList').length < 1){
        electronStore.set('categoryList',await (await getCategory()).data.data)
        categoryList.value = electronStore.get('categoryList')
    }else{
        categoryList.value = electronStore.get('categoryList')
    }
    changeCategory(categoryId.value)
})
</script>

<template>
    <div class="wallpapers flex justify-center flex-col items-center relative">
        <div nowState="hidden" class="category max-h-[30px] pt-3 flex flex-wrap overflow-hidden absolute z-[99] top-0 left-0 bg-[#fff]" ref="categoryListDom">
            <div class="item mb-10 mx-5 cursor-pointer hover:text-[#409EFF]" 
                v-for="(item, index) in categoryList" 
                :key="`item-${index}`"
                @click="changeCategory(item.old_id)"
                :class="{'text-[#409EFF]':categoryId == parseInt(item.old_id)}"
                >
                {{ item.category }}
            </div>
            <span class=" absolute top-3 right-2 text-[#409EFF] cursor-pointer" @click="showMore()" ref="more">展开更多</span>
        </div>
        <!-- 壁纸展示列表 -->
        <div class="wallpapers-list mt-50 grid grid-rows-4 grid-cols-5 gap-2">
            <div class="list-items relative" v-for="(item, index) in imageList.list" :key="`img-${index}`">
                <img v-lazy="item.url" 
                @click="openViewImg(item)"
                class="rounded-lg cursor-pointer " alt="" 
                style="width: 100%;height: 100%;">
                <!-- <div class="bottom-tools w-[20%] h-[25%] rounded-md absolute top-0 right-0">

                </div> -->
            </div>
            <ViewImg v-model:showView="showView" :imgInfo="imgInfo"/>
        </div>
        <el-pagination small background 
        class="mt-1"
        layout="prev, pager, next" 
        @current-change="handleCurrentChange"
        :default-page-size="20"
        :total="total" />
    </div>
</template>

<style scoped lang="less">
.wallpapers{
    padding-top: 1px;
    .category{
        box-shadow: 0px 6px 6px #ececec;
        font-size: 14px;
        user-select: none;
    }
    .wallpapers-list{
        height: calc(100vh - 180px);
        margin-top: 50px;
        padding: 5px 10px;
    }
    .list-items{
        overflow: hidden;
        img{
            transition: transform .5s;
        }
        &:hover{
            box-shadow: 0 0px 0px 2px rgb(0, 174, 255);
            border-radius: 5px;
            img{
                transform: scale(1.5);
            }
            .bottom-tools{
                opacity: 1;
            }
        }
        .bottom-tools{
            transition: all .2s;
            opacity: 0;
            border: 1px solid #fff;
        }
    }
}
</style>