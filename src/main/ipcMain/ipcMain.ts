import { app, dialog, ipcMain, shell } from "electron";
import path from "path";
import setWindowsWallPaper from "../utils/setwindows";
import { SetMouseHook } from "../utils/setMouseHook";
import setDynamicWallpaper from "../utils/setDynamicWallpaper";
import { createVideoWindow, createVideoWindow2 } from "../creatWindow";
export default function ipcMainList() {
   let videoWindow:any = null,videoWindow2:any = null
    // 打开文件夹
    ipcMain.on('openDir', (_e) => {
        let pathname = '/wallpaperDir'
        if (process.platform == 'win32') {
            pathname = '\\wallpaperDir'
        }
        let dirPath = app.isPackaged ? path.dirname(app.getPath('exe')) + pathname : app.getAppPath() + pathname;
        shell.openPath(dirPath)
    })
    // 发送当前安装路径
    ipcMain.handle('getAppPath', (_e) => {
        return app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
    })

    // 接受打开文件夹请求
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

    ipcMain.on("getVideos",(_e,msg) => {
        console.log(msg);
        
      })
      // windows设置静态壁纸
      ipcMain.handle('setwindows', async (_event, param) => {
        return setWindowsWallPaper(param.winfilepath);
      });
      // 开启mouseHook（网页壁纸交互）
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
              setDynamicWallpaper(videoWindow.getNativeWindowHandle().readInt32LE(0))
            }
            // 设置窗口视频或者网页,发送文件路径
            setTimeout(() => {
              videoWindow.webContents.send("getFilePath", filepath[0])
              return true;
            }, 1000);
          }
          if(process.platform === 'darwin'){
            if(!videoWindow2){
              videoWindow2 = createVideoWindow2();
            }
            // 设置窗口视频或者网页,发送文件路径
            setTimeout(() => {
              videoWindow2.webContents.send("getFilePath", filepath[0])
            }, 1000);
            
          }
        }
      
      })
}

// 打开视频或网页文件选择对话框
async function openFileDialog() {
    let { canceled, filePaths } = await dialog.showOpenDialog({
      title: "选择动态壁纸",
      filters: [
        { name: "视频", extensions: ["mp4", "mov", "html", "htm"] }
      ]
    })
    if (!canceled) {
      return filePaths
    } else {
      return false
    }
}