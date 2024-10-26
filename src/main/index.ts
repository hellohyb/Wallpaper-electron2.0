import { app, shell, BrowserWindow, ipcMain, dialog, Tray, Menu } from 'electron'
import { join } from 'path'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/iconTray.png?asset'
app.commandLine.appendSwitch('disable-web-security');
let mainWindow
function createWindow(): void {
  // Create the browser window.
 mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth:900,
    minHeight:670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration:true,
      contextIsolation:false,
      webSecurity:false
    }
  })
// 接受打开文件夹请求
ipcMain.handle('selectFile',async (_e) => {
  let {canceled,filePaths} = await dialog.showOpenDialog({
    title:"选择壁纸",
    filters:[
      {name:"图片",extensions:["jpg","png"]}
    ]
  })
  if(!canceled){
    return filePaths
  }else{
    return false
  }
})

// 打开文件夹
ipcMain.on('openDir',(_e) => {
  let dirPath = app.isPackaged ? path.dirname(app.getPath('exe')) + "/wallpaperDir" : app.getAppPath() + "/wallpaperDir";
  shell.openPath(dirPath)
})
// 发送当前安装路径
ipcMain.handle('getAppPath',(_e) => {
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

// Menu.setApplicationMenu(Menu.buildFromTemplate([]))
let tray:any
app.whenReady().then(() => {
  // 创建系统托盘图标
  tray = new Tray(icon); // 替换为你的图标路径
  // 创建上下文菜单
  const contextMenu = Menu.buildFromTemplate([
      {
          label: '打开主界面',
          click: () => {
              mainWindow.show()
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
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
