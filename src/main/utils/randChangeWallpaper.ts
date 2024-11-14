import { ipcMain } from "electron"
import {randChangeWallpaperByLocal, randWallpaper, randWallpaperByFavorite} from "./randWallpaper"
const fs = require('fs');
const path = require('path');

let configs
let favoriteList
ipcMain.on('send-config',(_e,msg) => {
    configs = msg.config
    favoriteList = msg.favoriteList
})
let timer
export async function startRandChangeWallpaper(mainWindow){
    // 分钟转为毫秒
    let newTimeout = configs.player.changeTime * 60 * 1000
    // 随机播放壁纸库
    if(configs.player.no === 1){
        randWallpaper(mainWindow)
        timer = setInterval(() => {
            randWallpaper(mainWindow)
        },newTimeout)
    }
    // 播放收藏夹
    let favoriteListPaths:any = []
    if(configs.player.no === 2){
        // 遍历该收藏夹，把图片地址存放起来
        for(let i = 0; i < favoriteList.length; i++){
            if(favoriteList[i].categoryName === configs.player.favoriteName){
                for(let j = 0; j < favoriteList[i].imgList.length; j++){
                    favoriteListPaths.push(favoriteList[i].imgList[j].url)
                }
            }
        }
        // randWallpaperByFavorite(mainWindow,favoriteListPaths,configs.player.order)
        if(configs.player.order === 1){ // 顺序
            randWallpaperByFavorite(mainWindow,favoriteListPaths[0])
            let i = 1
            timer = setInterval(() => {
                if(i > favoriteListPaths.length - 1){
                    i = 0
                }
                randWallpaperByFavorite(mainWindow,favoriteListPaths[i++])
            },newTimeout)
        }else if(configs.player.order === 0){ // 随机
            randWallpaperByFavorite(mainWindow,favoriteListPaths[getRandomIntNonRepeating(favoriteListPaths.length)])
            timer = setInterval(() => {
                if(favoriteListPaths.length > 1){
                    randWallpaperByFavorite(mainWindow,favoriteListPaths[getRandomIntNonRepeating(favoriteListPaths.length)])
                }else{
                    randWallpaperByFavorite(mainWindow,favoriteListPaths[0])
                }
            },newTimeout)
        }
    }

    // 本地目录
    let LocalListPaths:any = []
    if(configs.player.no === 3){
        // 获取文件夹图片
        LocalListPaths = await getImageFilesFromFolder(configs.player.localPath)
        console.log(LocalListPaths);
        if(LocalListPaths.length >= 1){
            if(configs.player.order === 1){
                randChangeWallpaperByLocal(mainWindow,LocalListPaths[0])
                let i = 1
                timer = setInterval(() => {
                    if(i > LocalListPaths.length - 1){
                        i = 0
                    }
                    randChangeWallpaperByLocal(mainWindow,LocalListPaths[i++])
                },newTimeout)
            }
        }else if(configs.player.order === 0){
            randChangeWallpaperByLocal(mainWindow,LocalListPaths[getRandomIntNonRepeating(LocalListPaths.length)])
            timer = setInterval(() => {
                if(LocalListPaths.length > 1){
                    randChangeWallpaperByLocal(mainWindow,LocalListPaths[getRandomIntNonRepeating(LocalListPaths.length)])
                }else{
                    randChangeWallpaperByLocal(mainWindow,LocalListPaths[0])
                }
            },newTimeout)
        }
    }
    
}
export function stopRandChangeWallpaper(){
    clearInterval(timer)
    timer = null
}
// 随机数，0-max（不包含max）
let previousNumber = null;  // 记录上一次生成的数字
function getRandomIntNonRepeating(max) {
    let randomNum;
    do {
        randomNum = Math.floor(Math.random() * max);
    } while (randomNum === previousNumber);  // 检查新数是否与上次相同

    previousNumber = randomNum;  // 更新上次生成的数字
    return randomNum;
}




// 判断文件是否为图片的辅助函数
function isImageFile(fileName) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp'];
    const ext = path.extname(fileName).toLowerCase();
    return imageExtensions.includes(ext);
}
// 遍历文件夹并筛选图片文件
 function getImageFilesFromFolder(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                reject(`Error reading folder: ${err}`);
                return;
            }
            
            // 筛选出图片文件
            const imageFiles = files
                .filter(file => isImageFile(file))  // 筛选图片文件
                .map(file => path.join(folderPath, file)); // 生成完整路径
            
            resolve(imageFiles);
        });
    });
}
