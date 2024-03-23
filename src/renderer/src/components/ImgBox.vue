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
        :src="imgInfo!.url"
        @click="openViewImg()"
        style="width: 100%;height: 100%;"
         alt="img">
    </div>
    <ViewImg v-model:showView="showView" :imgInfo="imgInfo"/>
</template>

<style lang="less" scoped>
.imgBox{
    width: 30%;
    height: calc(30vw*(1/2));
    overflow: hidden;
    margin-bottom: 10px;
    img{
        transition: transform .5s;
        border-radius: 5px;
    }
    &:hover{
        box-shadow: 0 0px 0px 2px rgb(0, 174, 255);
        border-radius: 5px;
        img{
            transform: scale(1.5);
        }
    }
}
</style>