import { app } from "electron";
const Koffi = require('koffi');
const path = require('path');
const isWin = process.platform === 'win32'
let myLibrary,SetMouseHookDll,UnhookMouseDll
if(isWin){
  // 加载 DLL
  let dllPath;
  if (app.isPackaged) {
    dllPath = path.join(process.resourcesPath, 'lib', 'mousehook2.dll');
  } else {
    dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'mousehook.dll');
  }
  myLibrary = Koffi.load(dllPath);
  SetMouseHookDll = myLibrary.func('SetMouseHook', 'void', ['ulong'])
  UnhookMouseDll = myLibrary.func('UnhookMouse', 'void', [])
}
export function SetMouseHook(handles) {
  if(isWin){
    SetMouseHookDll(handles);
  }
}

export function UnhookMouse() {
  if(isWin){
    UnhookMouseDll();
  }
}
