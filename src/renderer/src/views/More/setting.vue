<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { Edit, Folder,InfoFilled } from '@element-plus/icons-vue'
const ipcRenderer = window.electron.ipcRenderer
const electronStore = window.electronStore
const oldConfig = electronStore.get("config")
const config = reactive(oldConfig)
// 修改下载文件夹
const selectDir = async () => {
  const DirPath = await ipcRenderer.invoke('selectDir')
  if (DirPath) {
    config.downloadPath = DirPath
  }
}
const openCacheDir = () => {
  ipcRenderer.invoke('openDir')
}
const selectLocalPlayerDir = async () => {
    const DirPath = await ipcRenderer.invoke('selectDir')
    if (DirPath) {
        config.player.localPath = DirPath
    }
}
// 保存修改
const saveSetting = () => {
  electronStore.set('config', JSON.parse(JSON.stringify(config)))
}
let favoriteList = ref()
// 获取收藏夹信息，过滤掉为空的收藏夹
const getFavoriteList = () => {
    favoriteList.value = electronStore.get("favorite").filter((item) => {
      return item.imgList.length != 0
    })
}
watch(config,(_new,_old) => {
    saveSetting()
    // 深拷贝
    const configStr = JSON.parse(JSON.stringify(config))
    ipcRenderer.send('send-config',{config:configStr,favoriteList:JSON.parse(JSON.stringify(favoriteList.value))})
},{deep:true})
onMounted(async () => {
  getFavoriteList()
})
</script>

<template>
  <div class="setting">
    <div class="set-item">
      <h3 class="title">壁纸设置</h3>
      <p style="font-size: 14px; font-weight: bold">壁纸下载地址</p>
      <div class="items">
        <span>下载地址</span>
        <el-input v-model="config.downloadPath" style="width: 70%" :disabled="true" />
        <el-button type="primary" :icon="Edit" @click="selectDir()">修改</el-button>
      </div>
      <div class="items">
        <span>缓存地址</span>
        <el-input :value="config.cachePath" style="width: 70%" :disabled="true" />
        <el-button type="primary" :icon="Folder" @click="openCacheDir()">打开</el-button>
      </div>
      <p style="font-size: 14px; font-weight: bold">图片壁纸播放设置</p>
      <div class="items">
        <span>选择播放目录：</span>
        <el-radio-group v-model="config.player.no">
          <el-radio :value="1">壁纸库</el-radio>
          <el-radio :value="2">
            <span style="margin-right: 5px;">我的收藏</span>
            <el-select
            v-model="config.player.favoriteName"
            placeholder="选择收藏夹"
            size="small"
            style="width: 100px"
            @click="config.player.no = 2"
            >
                <el-option
                    v-for="item in favoriteList"
                    :key="item.categoryName"
                    :label="item.categoryName"
                    :value="item.categoryName"
                />
            </el-select>
            <el-tooltip
            class="box-item"
            effect="dark"
            content="不会包含空收藏夹"
            placement="top"
          >
          <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </el-radio>
          <el-radio :value="3">
            <span>本地目录:</span>
            <span style="margin:0 2px;font-size: 12px;">{{ config.player.localPath === '' ? "请先选择目录" : config.player.localPath}}</span>
            <el-button type="primary" size="small" :icon="Edit" @click="selectLocalPlayerDir()"></el-button>
            </el-radio>
        </el-radio-group>
      </div>
      <div class="items">
        <span>播放顺序：</span>
        <el-radio-group v-model="config.player.order" v-if="config.player.no !== 1">
          <el-radio :value="1" border>按顺序播放</el-radio>
          <el-radio :value="0" border>随机播放</el-radio>
        </el-radio-group>
        <span v-else style="color: teal;">壁纸库默认随机播放</span>
      </div>
      <div class="items">
        <span>壁纸切换间隔：</span>
        <el-input-number v-model="config.player.changeTime" :min="1" :max="100">
        <template #suffix>
            <span>分钟</span>
        </template>
        </el-input-number>
      </div>
      <span style="font-size: 12px; color: teal">当目录设置为本地目录时，请确保文件夹里面图片文件不为空。设置完成时请在菜单栏重新开启播放壁纸。</span>
    </div>
    <div class="set-item">
      <h3 class="title">应用设置</h3>
      <div class="items">
        <span style="margin-right: 5px">开机启动</span>
        <el-switch v-model="config.start" size="large" />
        <span style="margin-left: 20px; margin-right: 5px">GPU加速</span>
        <el-switch v-model="config.GPU" size="large" />
      </div>
      <div class="items">
        <span style="margin-right: 10px">关闭窗口时(未设置动态壁纸时)</span>
        <el-radio-group v-model="config.closeWindow">
          <el-radio :value="1" border>最小化</el-radio>
          <el-radio :value="0" border>直接退出</el-radio>
        </el-radio-group>
        <br />
        <span style="font-size: 12px; color: teal">动态壁纸运行时关闭窗口默认为最小化，如需退出应用可在任务栏图标右键菜单退出</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.setting {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: scroll;
  color: rgb(72, 72, 72);
  .set-item {
    border: 1px solid rgb(235, 235, 235);
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    padding-top: 0px;
    border-radius: 10px;
    margin-bottom: 10px;
    .title {
      border-bottom: 1px solid rgb(207, 207, 207);
      line-height: 50px;
    }
    .items {
      font-size: 14px;
      width: 100%;
      margin: 10px auto;
      &:deep(.el-radio__label){
        display: flex;
        align-items: center;
      }
      &:deep(.el-input-number__decrease){
        background-color: transparent;
      }
      &:deep(.el-input-number__increase){
        background-color: transparent;
      }
    }
  }
}
</style>
