<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

const ipcRenderer = window.electron.ipcRenderer
const filePath = ref('')

// 监听 IPC 消息以获取文件路径
ipcRenderer.on("getFilePath", (_e, filePaths) => {
    filePath.value = filePaths
})
const showVideo = ref(true)
// 引用 video 元素
const videoRef:any = ref(null)
const htmlRef:any = ref(null)
// 监视 filePath 的变化
watch(filePath, (newPath) => {
    if (videoRef.value) {
        if(verifyFile(newPath) === 'html'){
           
            if(htmlRef.value){
                console.log(newPath);
            }
            showVideo.value = false
            htmlRef.value.src = newPath
        }
        else if(verifyFile(newPath) === 'video'){
            showVideo.value = true
            // 重新加载视频
            videoRef.value.load()
            // 自动播放新视频
            // videoRef.value.play()
            // 更新 video 元素的 src 属性
            videoRef.value.src = newPath
        }
        
    }
})
const fileTypes = {
    html:['html','htm'],
    video:['mp4','mov']
}
// 判断当前文件是视频还是html
const verifyFile = (filePath) => {
    const fileType = filePath.slice(filePath.lastIndexOf('.')+1,filePath.length)
    if(fileTypes.html.includes(fileType)){
        return 'html'
    }
    if(fileTypes.video.includes(fileType)){
        return 'video'
    }
    return;
}

document.addEventListener('mousemove',() => {
    ipcRenderer.send("posmsg","movemovemove")
})
</script>

<template>
    <div class="contentss">
        <video v-show="showVideo" ref="videoRef" autoplay muted loop style="width: 100vw;height: 100vh;border: none;outline: none;">
            <source :src="filePath" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <iframe v-show="!showVideo" id="iframe" ref="htmlRef" scrolling="no" :src="filePath" frameborder="0">

        </iframe>
    </div>
</template>
<style lang="less" scoped>
.contentss{
    margin: 0px;
    padding: 0px;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    overflow: hidden !important;
    transform: translateY(-3px);
    #iframe{
        width: 100%;
        height: 100%;
        border: none;
        overflow: hidden;
        display: block;
        &::-webkit-scrollbar {
            display: none !important; /* 隐藏滚动条 */
        }
    }
    #iframe::-webkit-scrollbar {
            display: none !important; /* 隐藏滚动条 */
    }
}
</style>