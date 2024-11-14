import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const storeSend = (action: string, key: string, value = null) => ipcRenderer.sendSync('store-send',{action, key, value})
const electronStore:any = {
  get:(key: string) => storeSend('get',key),
  set:(key: string,value:any) => storeSend('set',key,value)
}
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronStore',electronStore)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
   // @ts-ignore (define in dts)
  window.electronStore = electronStore
}
