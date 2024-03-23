const ipcRenderer = window.electron.ipcRenderer
// 获取当前安装目录，并返回默认存放图片的文件夹路径
export default async function getDefaultDirectory(){
    const appPath = await ipcRenderer.invoke("getAppPath")
    return appPath + '/wallpaperDir'
}