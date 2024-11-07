<script lang="ts" setup>
import { type Ref, ref } from 'vue';
import ViewImg from './ViewImg.vue';
defineProps({
    imgInfo:Object
})
const showView:Ref<boolean> = ref(false)
// 打开图片详情
const openViewImg = () => {
    showView.value = true
}

</script>

<template>
    <div class="imgBox cursor-pointer mx-2">
        <img 
        class="imgs"
        :src="imgInfo!.url"
        @click="openViewImg()"
        style="width: 100%;height: 100%;"
         alt="img">
         <ViewImg v-model:showView="showView" :imgInfo="imgInfo" style="cursor: default;"/>
    </div>
    
</template>

<style lang="less" scoped>
.imgBox{
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin-bottom: 10px;
    border-radius: 5px;
    &:has(.imgs:hover){
        box-shadow: 0 0px 0px 2px rgb(0, 174, 255);
    }
    img{
        transition: transform .5s;
        border-radius: 5px;
        &:hover{
        transform: scale(1.5);
    }
    }
    
}
</style>