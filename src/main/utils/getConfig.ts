import { ipcMain } from "electron"

export default function getConfig(){
    return new Promise(resolve => {
        ipcMain.on('send-config',(_e,config) => {
            resolve(config)
        })
    })
    
}