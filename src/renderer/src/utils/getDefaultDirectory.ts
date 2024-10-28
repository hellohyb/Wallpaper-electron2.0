const ipcRenderer = window.electron.ipcRenderer
// 获取当前安装目录，并返回默认存放图片的文件夹路径
export default async function getDefaultDirectory(){
    const appPath = await ipcRenderer.invoke("getAppPath")
    let defaultPath = '/wallpaperDir'
    if(process.platform == 'win32'){
        defaultPath = '\\wallpaperDir'
      }
    return appPath + defaultPath
}