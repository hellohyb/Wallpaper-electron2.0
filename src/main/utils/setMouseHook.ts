import { app } from "electron";
const Koffi = require('koffi');
const path = require('path');
// 加载 DLL
let dllPath;
if (app.isPackaged) {
  dllPath = path.join(process.resourcesPath, 'lib', 'mousehook2.dll');
} else {
  dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'mousehook.dll');
}
const myLibrary = Koffi.load(dllPath);
const SetMouseHookDll = myLibrary.func('SetMouseHook', 'void', ['ulong'])
const UnhookMouseDll = myLibrary.func('UnhookMouse', 'void', [])
export function SetMouseHook(handles) {
    SetMouseHookDll.SetMouseHook(handles);
}

export function UnhookMouse() {
    UnhookMouseDll.UnhookMouse();
}
