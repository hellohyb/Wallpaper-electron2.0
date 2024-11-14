import { app, dialog, ipcMain, shell } from "electron";
import path from "path";
import setWindowsWallPaper from "../utils/setwindows";
import { SetMouseHook } from "../utils/setMouseHook";
import setDynamicWallpaper from "../utils/setDynamicWallpaper";
import { createVideoWindow, createVideoWindow2 } from "../createWindow";
let videoWindow: any = null, videoWindow2: any = null
let store
(async() => {
  // 使用动态 import() 加载 electron-store
  const module = await import('electron-store');
  let Store = module.default;
  store = new Store(); 
})();
export function ipcMainList() {
  // 打开文件夹
  ipcMain.handle('openDir', (_e,msg = null) => {
    let dirPath
    if(msg === null){
      let pathname = '/wallpaperDir'
      if (process.platform == 'win32') {
        pathname = '\\wallpaperDir'
      }
      dirPath = app.isPackaged ? path.dirname(app.getPath('exe')) + pathname : app.getAppPath() + pathname;
    }else{
      dirPath = msg
    }
    return shell.openPath(dirPath)
  })
  // 选择文件夹，并返回文件夹路径
  ipcMain.handle('selectDir',async (_e) => {
    const result = await dialog.showOpenDialog({
      title:"选择存放图片的文件夹",
      properties: ['openDirectory']  // 只允许选择文件夹
    });
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return;
  })
  // 发送当前安装路径
  ipcMain.handle('getAppPath', (_e) => {
    return app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
  })

  // 打开选择文件对话框（选择图片壁纸）
  ipcMain.handle('selectFile', async (_e) => {
    let { canceled, filePaths } = await dialog.showOpenDialog({
      title: "选择壁纸",
      filters: [
        { name: "图片", extensions: ["jpg", "png"] }
      ]
    })
    if (!canceled) {
      return filePaths
    } else {
      return false
    }
  })
  
  // windows设置静态壁纸
  ipcMain.handle('setwindows', async (_event, param) => {
    return setWindowsWallPaper(param.winfilepath);
  });
  // 开启mouseHook（Windows网页壁纸交互）
  ipcMain.handle('openMouseHook', (_e) => {
    if (videoWindow) {
      SetMouseHook(videoWindow.getNativeWindowHandle().readInt32LE(0))
    }
  })
  // windows macos设置动态壁纸
  ipcMain.handle('setDynamicWin', async (_e) => {
    const filepath = await openFileDialog();
    if (filepath) {
      if (process.platform === 'win32') {
        // 如果播放窗口未打开
        if (!videoWindow) {
          videoWindow = createVideoWindow();
          videoWindow.on('closed', () => {
            videoWindow = null;  // 确保清理引用
          });
          setDynamicWallpaper(videoWindow.getNativeWindowHandle().readInt32LE(0))
        }
        // 设置窗口视频或者网页,发送文件路径
        setTimeout(() => {
          videoWindow.webContents.send("getFilePath", filepath[0])
          return true;
        }, 1000);
      }
      if (process.platform === 'darwin') {
        if (!videoWindow2) {
          videoWindow2 = createVideoWindow2();
          videoWindow2.on('closed', () => {
            videoWindow2 = null;  // 确保清理引用
          });
        }
        // 设置窗口视频或者网页,发送文件路径
        setTimeout(() => {
          videoWindow2.webContents.send("getFilePath", filepath[0])
        }, 1000);

      }
    }

  })

  // 更换静态壁纸时关闭动态壁纸窗口
  ipcMain.handle('closeVideoWindow',(_e) => {
    if(videoWindow){
      videoWindow.close()
      videoWindow = null
    }
    if(videoWindow2){
      videoWindow2.close()
      videoWindow = null
    }
  })
  // 获取electron-store
  ipcMain.on('store-send',(event,params) => {
    const {action, key, value} = params
    switch(action){
      case 'get':
        event.returnValue = store.get(key);
        break;
      case 'set':
        event.returnValue = store.set(key,value);
        break;
    }
  })
}

export function getVideoWindow(){
  return {videoWindow,videoWindow2}
  
}
// 打开视频或网页文件选择对话框
async function openFileDialog() {
  let { canceled, filePaths } = await dialog.showOpenDialog({
    title: "选择动态壁纸",
    filters: [
      { name: "视频", extensions: ["mp4","webm"] }
    ]
  })
  if (!canceled) {
    return filePaths
  } else {
    return false
  }
}