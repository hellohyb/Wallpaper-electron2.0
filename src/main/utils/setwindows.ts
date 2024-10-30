import { app } from "electron";
const path = require('path');
const ffi = require('ffi-napi');
const gbk = require('encoding')

let dllPath;
if (app.isPackaged) {
  dllPath = path.join(process.resourcesPath, 'lib', 'changewallpaper.dll');
} else {
  dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'changewallpaper.dll');
}
export default function setWindowsWallPaper(filepath) {
  const myDlls = ffi.Library(dllPath,{
    'ChangeWallpaper': ['bool', ['string']]
  })
  return myDlls.ChangeWallpaper(gbk.convert(filepath,'GBK'));
}
