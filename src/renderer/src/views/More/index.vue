<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const sildeBarInfo = [
    {
        path:'/more/setting',
        name:'偏好设置',
        icon:'<svg t="1730898344259" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4307" width="30" height="30"><path d="M439.264 208a16 16 0 0 0-16 16v67.968a239.744 239.744 0 0 0-46.496 26.896l-58.912-34a16 16 0 0 0-21.856 5.856l-80 138.56a16 16 0 0 0 5.856 21.856l58.896 34a242.624 242.624 0 0 0 0 53.728l-58.88 34a16 16 0 0 0-6.72 20.176l0.848 1.68 80 138.56a16 16 0 0 0 21.856 5.856l58.912-34a239.744 239.744 0 0 0 46.496 26.88V800a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-67.968a239.744 239.744 0 0 0 46.512-26.896l58.912 34a16 16 0 0 0 21.856-5.856l80-138.56a16 16 0 0 0-4.288-20.832l-1.568-1.024-58.896-34a242.624 242.624 0 0 0 0-53.728l58.88-34a16 16 0 0 0 6.72-20.176l-0.848-1.68-80-138.56a16 16 0 0 0-21.856-5.856l-58.912 34a239.744 239.744 0 0 0-46.496-26.88V224a16 16 0 0 0-16-16h-160z m32 48h96v67.376l28.8 12.576c13.152 5.76 25.632 12.976 37.184 21.52l25.28 18.688 58.448-33.728 48 83.136-58.368 33.68 3.472 31.2a194.624 194.624 0 0 1 0 43.104l-3.472 31.2 58.368 33.68-48 83.136-58.432-33.728-25.296 18.688c-11.552 8.544-24.032 15.76-37.184 21.52l-28.8 12.576V768h-96v-67.376l-28.784-12.576c-13.152-5.76-25.632-12.976-37.184-21.52l-25.28-18.688-58.448 33.728-48-83.136 58.368-33.68-3.472-31.2a194.624 194.624 0 0 1 0-43.104l3.472-31.2-58.368-33.68 48-83.136 58.432 33.728 25.296-18.688a191.744 191.744 0 0 1 37.184-21.52l28.8-12.576V256z m47.28 144a112 112 0 1 0 0 224 112 112 0 0 0 0-224z m0 48a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" fill="#707070" p-id="4308"></path></svg>',
        func:function(){
            router.push(this.path)
        }
    },
    {
        path:'/more/about',
        name:'关于',
        icon:'<svg t="1731383195107" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5046" width="28" height="28"><path d="M512 128a384 384 0 1 1 0 768 384 384 0 0 1 0-768z m0 85.333333a298.666667 298.666667 0 1 0 0 597.333334 298.666667 298.666667 0 0 0 0-597.333334z m21.333333 234.666667a21.333333 21.333333 0 0 1 21.333334 21.333333v212.992a21.333333 21.333333 0 0 1-21.333334 21.333334h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333334V469.333333a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z m0-128a21.333333 21.333333 0 0 1 21.333334 21.333333v42.325334a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333V341.333333a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z" fill="#707070" p-id="5047"></path></svg>',
        func:function(){
            router.push(this.path)
        }
    },
]
</script>

<template>
    <div class="moreView">
        <div class="slideBar">
            <ul class="w-[100%] h-[100%] m-0 px-1 py-5 box-border flex flex-col justify-start items-center">
                <li 
                v-for="(item, index) in sildeBarInfo"
                :key="index"
                @click="item.func()"
                :class="{'btn-active':router.currentRoute.value.path === item.path}"
                class="w-[100%] border-b-1 my-1 bg-white hover:btn-active cursor-pointer text-sm flex items-center">
                    <div v-html="item.icon" class="mt-1 ml-4"></div>
                    <span>{{ item.name }}</span>
                </li>
            </ul>
        </div>
        <div class="moreContent">
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="less" scoped>
ul,li{
    list-style: none;
}
.moreView{
    width: 100vw;
    height: calc(100vh - 90px);
    margin: 5px auto;
    display: flex;
    user-select: none;
    .slideBar{
        width: 130px;
        height: 100%;
        border-right: 1px solid rgb(216, 216, 216);
    }
    .moreContent{
        flex:1;
    }
}
</style>