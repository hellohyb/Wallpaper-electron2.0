import { app } from "electron";
const ffi = require('ffi-napi');
const path = require('path');
// 加载 DLL
let dllPath;
if (app.isPackaged) {
  dllPath = path.join(process.resourcesPath, 'lib', 'mousehook2.dll');
} else {
  dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'mousehook.dll');
}
const mouseHookDLL = ffi.Library(dllPath, {
    'SetMouseHook': ['void', ['ulong']], // 这里传递无符号长整型
    'UnhookMouse': ['void', []]
});

export function SetMouseHook(handles){
    mouseHookDLL.SetMouseHook(handles);
}

export function UnhookMouse(){
    mouseHookDLL.UnhookMouse();
}
