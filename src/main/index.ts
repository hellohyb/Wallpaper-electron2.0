import { app, shell, BrowserWindow, ipcMain, dialog, Tray, Menu, screen } from 'electron'
import { join } from 'path'
const path = require("path")
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/iconTray.png?asset'
import setWindowsWallPaper from './utils/setwindows'
import setDynamicWallpaper from './utils/setDynamicWallpaper'
import { SetMouseHook, UnhookMouse } from './utils/setMouseHook'
import setMacDynamicWallpaper from './utils/setMacDynamicWallpaper'
app.commandLine.appendSwitch('disable-web-security');
let mainWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    frame: process.platform === 'win32' ? true : false,
    titleBarStyle: process.platform === 'win32' ? 'default' : 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
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
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
let videoWindow
function createVideoWindow() {
  videoWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false,
    transparent: true,
    focusable: false,
    alwaysOnTop: true,
    fullscreen:true,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === 'win32' ? 'default' : 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    videoWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/video')
  } else {
    videoWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: "/video" })
  }
  videoWindow.on('ready-to-show', () => {
    videoWindow.show()
  })
  videoWindow.on('close', () => {
    if(process.platform === 'win32'){
      UnhookMouse()
    }
  })
}

let videoWindow2
function createVideoWindow2() {
  const { x,y,width, height } = screen.getPrimaryDisplay().bounds;
  console.log({ x,y,width, height } );
  
  videoWindow2 = new BrowserWindow({
    x:x,
    y:y,
    width:width,
    height:height,
    frame:false,
    transparent:true,
    useContentSize: true,
    resizable: false,
    autoHideMenuBar:true,
    show: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  })
  videoWindow2.setHasShadow(false)
  app.dock.hide()
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    videoWindow2.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/#/video')
  } else {
    videoWindow2.loadFile(join(__dirname, '../renderer/index.html'), { hash: "/video" })
  }
  videoWindow2.on('ready-to-show',() => {
    videoWindow2.show()
  })
  // 在窗口加载后获取 PID
  videoWindow2.webContents.on('did-finish-load', () => {
      setMacDynamicWallpaper(process.pid);
    });
}

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
// windows设置动态壁纸
ipcMain.handle('setDynamicWin', async (_e) => {
  const filepath = await openFileDialog();
  if (filepath) {
    if (process.platform === 'win32') {
      // 如果播放窗口未打开
      if (!videoWindow) {
        createVideoWindow();
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
        createVideoWindow2();
      }
      // 设置窗口视频或者网页,发送文件路径
      setTimeout(() => {
        videoWindow2.webContents.send("getFilePath", filepath[0])
      }, 1000);
      
    }
  }

})
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

// Menu.setApplicationMenu(Menu.buildFromTemplate([]))
let tray: any
app.whenReady().then(() => {
  // 创建系统托盘图标
  tray = new Tray(icon); // 替换为你的图标路径
  // 创建上下文菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);

  // 设置上下文菜单
  tray.setContextMenu(contextMenu);
  tray.setToolTip('wallpaper动态壁纸');
  // 单击托盘图标时的事件
  tray.on('click', () => {
    // createWindow();
    console.log(123);

  });
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    UnhookMouse()
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
