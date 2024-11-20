import { app, BrowserWindow, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/trayIcon/tray32-2.png?asset'
import { UnhookMouse } from './utils/setMouseHook'
import { ipcMainList, getVideoWindow } from './ipcMain'
import {randWallpaper} from './utils/randWallpaper'
import { startRandChangeWallpaper, stopRandChangeWallpaper } from './utils/randChangeWallpaper'
import initConfig from './utils/initConfig'
// app.commandLine.appendSwitch('disable-web-security');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// GPU加速
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
let mainWindow
let menuSwitch = false;
let startChanging = false;
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
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('close',(event) => {
    const remainingWindows = BrowserWindow.getAllWindows();
    // 如果当前还有动态壁纸窗口或者正在轮播壁纸 以及 不是点击的菜单栏里的退出选项
    if ((remainingWindows.length > 1 || startChanging) && !menuSwitch){
      event.preventDefault();  // 阻止窗口关闭
      mainWindow.minimize()
    }else if(menuSwitch){
      return;
    }
    
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
initConfig()
ipcMainList();
Menu.setApplicationMenu(Menu.buildFromTemplate([]))
let tray: any
let defaultMenu = [
  {
    label: '打开主界面',
    click: () => {
      if (mainWindow) {
        mainWindow.show();
      }
    }
  },
  {
    label: '换一张壁纸',
    click: async () => {
      randWallpaper(mainWindow)
    }
  },
  {
    label: '开启轮播壁纸',
    click: async () => {
      if(startChanging){
        stopRandChangeWallpaper()
        startChanging = false
      }else{
        startRandChangeWallpaper(mainWindow)
        startChanging = true
      }
    }
  },
  {
    label: '关闭动态壁纸',
    enabled: false,
    click: () => {
      if(getVideoWindow().videoWindow){
        getVideoWindow().videoWindow.close()
      }
      if(getVideoWindow().videoWindow2){
        getVideoWindow().videoWindow2.close()
      }
    }
  },
  {
    label: '退出',
    click: () => {
      menuSwitch = true
      app.quit();
    }
  }
]
let contextMenu
app.whenReady().then(() => {
  // 创建系统托盘图标
  tray = new Tray(icon); // 替换为你的图标路径
  // 创建上下文菜单
  contextMenu = Menu.buildFromTemplate(defaultMenu);

  // 设置上下文菜单
  tray.setToolTip('wallpaper动态壁纸');

  // 设置菜单
  const setMenu = () => {
        // 如果动态壁纸窗口正在运行，则显示关闭动态壁纸选项
        if(getVideoWindow().videoWindow || getVideoWindow().videoWindow2){
          defaultMenu[defaultMenu.length - 2].enabled = true
        }else{
          defaultMenu[defaultMenu.length - 2].enabled = false
        }
        // 如果随机播放图片壁纸正在运行，则显示停止播放
        if(startChanging){
          defaultMenu[defaultMenu.length - 3].label = '关闭轮播壁纸'
        }else{
          defaultMenu[defaultMenu.length - 3].label = '开启轮播壁纸'
        }
        contextMenu = Menu.buildFromTemplate(defaultMenu);
         // 手动弹出右键菜单
         tray.popUpContextMenu(contextMenu);
  }
  // 单击托盘图标时的事件
  tray.on('click', () => {
    // createWindow();
    setMenu()
  });
  tray.on('right-click',() => {
    setMenu()
  })
  tray.on('drop-files', (_event, files) => {
    // 这里可以添加对文件的处理逻辑
    mainWindow.webContents.send("dragLoaclImage",files)
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
  }else{
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
