import { app } from 'electron';
import path from 'path';
import fs from 'fs'
export default async function initConfig(){
    // 使用动态 import() 加载 electron-store
    const module = await import('electron-store');
    let Store = module.default;
    let store:any = new Store(); 
    if(!store.get("config")){
        let getFavorite = store.get("favorite") || false
        if(!getFavorite || getFavorite.length == 0){
          store.set('favorite',[{categoryName:'默认收藏',imgList:[]}])
        }
        let appPath = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
        let defaultPath = '/wallpaperDir'
        if(process.platform == 'win32'){
            defaultPath = '\\wallpaperDir'
          }
        mkdirsSync(appPath + defaultPath)
        const config = {
          downloadPath: appPath + defaultPath, // 下载地址
          cachePath: appPath + defaultPath, // 缓存地址
          player:{
            no:1,           // 1壁纸库随机，2收藏夹， 3本地目录
            localPath:'',   // 本地目录路径
            favoriteName:'默认收藏',    //  收藏夹名
            order:1,        // 1顺序，0随机
            changeTime: 10, // 壁纸切换间隔
          },
          closeWindow: 0, // 关闭窗口时：1:最小化，0:直接退出
          start: false, // 开机是否启动应用
          GPU: false
        }
        store.set("config",config)
    }
}


function mkdirsSync (dirname) {
    // 判断文件夹是否存在
      if (fs.existsSync(dirname)) {
        return true;
      }else {
        if (mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname);
          return true;
        }
      }
      return false
  }