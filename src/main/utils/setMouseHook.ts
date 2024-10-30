import { app } from "electron";
const isWindows = process.platform === 'win32'
const ffi = isWindows ? require('ffi-napi') : null;
const path = require('path');
// 加载 DLL
let dllPath;
if (app.isPackaged) {
  dllPath = path.join(process.resourcesPath, 'lib', 'mousehook2.dll');
} else {
  dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'mousehook.dll');
}
const mouseHookDLL = isWindows ? ffi.Library(dllPath, {
    'SetMouseHook': ['void', ['ulong']], // 这里传递无符号长整型
    'UnhookMouse': ['void', []]
}) : null

export function SetMouseHook(handles){
  if(process.platform === 'win32'){
    mouseHookDLL.SetMouseHook(handles);
  }
}

export function UnhookMouse(){
  if(process.platform === 'win32'){
    mouseHookDLL.UnhookMouse();
  }
}
