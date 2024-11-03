import { app } from "electron";
export default function setWindowsWallPaper(filepath) {
    const path = require('path');
    const koffi = require('koffi');
    let dllPath;
    if (app.isPackaged) {
      dllPath = path.join(process.resourcesPath, 'lib', 'changewallpaper.dll');
    } else {
      dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'changewallpaper.dll');
    }
    const lib = koffi.load(dllPath);
    const ChangeWallpaper = lib.func('ChangeWallpaper','bool', ['string'])
    return ChangeWallpaper(filepath);
  }

