import { ipcMain } from "electron"
import randWallpaper from "./randWallpaper"
let configs
ipcMain.on('send-config',(_e,config) => {
    configs = config
})
let timer
export function startRandChangeWallpaper(mainWindow){
    // 分钟转为毫秒
    let newTimeout = configs.player.changeTime * 60 * 1000
    randWallpaper(mainWindow)
    timer = setInterval(() => {
        randWallpaper(mainWindow)
    },newTimeout)
}

export function stopRandChangeWallpaper(){
    clearInterval(timer)
    timer = null
}