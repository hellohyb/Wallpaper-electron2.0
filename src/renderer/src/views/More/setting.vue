<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { Edit,Folder } from '@element-plus/icons-vue'
import getDefaultDirectory from '@renderer/utils/getDefaultDirectory';
const ipcRenderer = window.electron.ipcRenderer
const config = reactive({
    downloadPath:'', // 下载地址
    cachePath: '', // 缓存地址
    changeTime:10, // 壁纸切换间隔
    closeWindow:1,  // 关闭窗口时：1:最小化，0:直接退出
    start:false,     // 开机是否启动应用
    GPU:false
})
const timeOptions = [
    {
        value:10,
        label:'10分钟'
    },
    {
        value:20,
        label:'20分钟'
    },
    {
        value:30,
        label:'30分钟'
    },
    {
        value:60,
        label:'一小时'
    },
]
// 修改下载文件夹
const selectDir = async() => {
  const DirPath = await ipcRenderer.invoke('selectDir')
  if(DirPath){
    config.downloadPath = DirPath
  }
}
const openCacheDir = () => {
    ipcRenderer.invoke('openDir')
}
// 保存修改
const saveSetting = () => {
    localStorage.setItem("config",JSON.stringify(config))
}
onMounted(async () => {
    config.cachePath = await getDefaultDirectory()
})
</script>

<template>
    <div class="setting">
        <div class="set-item">
            <h3 class="title">壁纸设置</h3>
            <p style="font-size: 14px;font-weight: bold;">壁纸下载地址</p>
            <div class="items"><span>下载地址</span> <el-input v-model="config.downloadPath" style="width: 70%" :disabled="true"/> <el-button type="primary" :icon="Edit" @click="selectDir()">修改</el-button></div>
            <div class="items"><span>缓存地址</span> <el-input :value="config.cachePath" style="width: 70%" :disabled="true" /> <el-button type="primary" :icon="Folder" @click="openCacheDir()">打开</el-button></div>
            <p style="font-size: 14px;font-weight: bold;">图片壁纸播放设置</p>
            <div class="items">
                <span>自动换壁纸时间间隔：</span> 
                <el-select
                    v-model="config.changeTime"
                    placeholder="选择时间间隔"
                    size="default"
                    style="width: 240px"
                >
                    <el-option
                        v-for="item in timeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
        </div>

        <div class="set-item">
            <h3 class="title">应用设置</h3>
            <div class="items">
                <span style="margin-right: 5px;">开机启动</span> 
                <el-switch v-model="config.start" size="large" />
                <span style="margin-left: 20px;margin-right: 5px;">GPU加速</span> 
                <el-switch v-model="config.GPU" size="large" />
            </div>
            <div class="items">
                <span style="margin-right:10px;">关闭窗口时(未设置动态壁纸时)</span>
                <el-radio-group v-model="config.closeWindow">
                    <el-radio :value="1" border>最小化</el-radio>
                    <el-radio :value="0" border>直接退出</el-radio>
                </el-radio-group>
                <br/>
                <span style="font-size: 12px;color: teal;">动态壁纸运行时关闭窗口默认为最小化，如需退出应用可在任务栏图标右键菜单退出</span>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.setting{
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: scroll;
    color: rgb(72, 72, 72);
    .set-item{
        border: 1px solid rgb(235, 235, 235);
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 10px;
        padding-top: 0px;
        border-radius: 10px;
        margin-bottom: 10px;
        .title{
            border-bottom: 1px solid rgb(207, 207, 207);
            line-height: 50px;
        }
        .items{
            font-size: 14px;
            width: 100%;
            margin: 10px auto;
        }
    }
}
</style>