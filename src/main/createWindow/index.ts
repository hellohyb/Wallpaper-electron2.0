import { is } from "@electron-toolkit/utils"
import { app, BrowserWindow, screen } from "electron"
import { join } from "path"
import { UnhookMouse } from "../utils/setMouseHook"
import setMacDynamicWallpaper from "../utils/setMacDynamicWallpaper"

// windows动态壁纸窗口
export function createVideoWindow() {
    const videoWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent: true,
        focusable: false,
        alwaysOnTop: true,
        fullscreen: true,
        autoHideMenuBar: true,
        titleBarStyle: process.platform === 'win32' ? 'default' : 'hidden',
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
        if (process.platform === 'win32') {
            UnhookMouse()
        }
    })
    return videoWindow
}

// macos动态壁纸窗口
export function createVideoWindow2() {
    const { x, y, width, height } = screen.getPrimaryDisplay().bounds;
    let videoWindow2:any = new BrowserWindow({
        x:x,
        y:y,
        width: width,
        height: height,
        frame: false,
        transparent: true,
        resizable: false,
        simpleFullscreen:true,
        autoHideMenuBar: true,
        show: false,
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
    videoWindow2.on('ready-to-show', () => {
        videoWindow2.show()
    })
    // 在窗口加载后获取 PID
    videoWindow2.webContents.on('did-finish-load', () => {
        setMacDynamicWallpaper(process.pid);
    });
    videoWindow2.on('closed', () => {
        videoWindow2 = null;  // 确保清理引用
    });
    return videoWindow2
}