<script lang="ts" setup>
import { ref, watch } from 'vue'

const ipcRenderer = window.electron.ipcRenderer
const filePath = ref('')

// 监听 IPC 消息以获取文件路径
ipcRenderer.on("getFilePath", (_e, filePaths) => {
    filePath.value = 'file://' + filePaths
})
const showVideo = ref(true)
// 引用 video 元素
const videoRef:any = ref(null)
const htmlRef:any = ref(null)
// 监视 filePath 的变化
watch(filePath, (newPath) => {
    if (videoRef.value) {
        ipcRenderer.send("getVideos",newPath)
        if(verifyFile(newPath) === 'html'){
            showVideo.value = false
            htmlRef.value.src = newPath
            if(process.platform === 'win32'){
                ipcRenderer.invoke('openMouseHook')
            }
        }
        else if(verifyFile(newPath) === 'video'){
            showVideo.value = true
            // 重新加载视频
            videoRef.value.load()
            // 自动播放新视频
            videoRef.value.play()
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
document.title = "videoWallpaper"
</script>

<template>
    <div class="contentss" scroll="no">
        <video style="object-fit: fill; width: 100%;height: 95vh;" v-show="showVideo" ref="videoRef" autoplay muted loop class="video">
            <source :src="filePath" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <iframe v-show="!showVideo" id="iframe" ref="htmlRef" scrolling="no" :src="filePath" frameborder="0">

        </iframe>
    </div>
</template>
<style lang="less" scoped>
.contentss{
    width: 100%;
    max-height: 100%;
    overflow-y: hidden;
    transform: translateY(-30px);
    &::-webkit-scrollbar{
        width: 0px;
        height: 0px;
        display: none;
        scrollbar-width: none;
        border: 0;
    }
    .video{
        width: 100%;
        height: 100%;
        border: none;
        object-fit: cover;
    }
    #iframe{
        width: 100%;
        height: 100%;
        border: none;
        overflow: hidden;
    }
}
</style>