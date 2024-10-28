import { app } from "electron";
const path = require('path');
const ffi = require('ffi-napi');
const gbk = require('encoding')

export default function setWindowsWallPaper(filepath) {
  let dllPath = path.join(app.getAppPath(), 'resources','changewallpaper.dll');

  const myDlls = ffi.Library(dllPath,{
    'ChangeWallpaper': ['bool', ['string']]
  })
  return myDlls.ChangeWallpaper(gbk.convert(filepath,'GBK'));
}
