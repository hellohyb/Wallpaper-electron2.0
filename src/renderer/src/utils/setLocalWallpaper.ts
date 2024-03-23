const ipcRenderer = window.electron.ipcRenderer
import setWallpaper from '@renderer/utils/setWallpaper'
export default async function setLocalWallpaper(){
    const filePaths = await ipcRenderer.invoke("selectFile")
    if(filePaths){
        setWallpaper(filePaths[0])
        return true
    }else{
        return false
    }
}