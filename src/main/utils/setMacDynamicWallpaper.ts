import { app } from "electron";
const path = require('path');
const Koffi = require('koffi');

let dllPath;
if (app.isPackaged) {
  dllPath = path.join(__dirname, '..', '..', '..', 'app.asar.unpacked', 'resources', 'lib', 'test.dylib');
} else {
  dllPath = path.join(app.getAppPath(), 'resources', 'lib', 'test.dylib');
}
export default function setMacDynamicWallpaper(handles) {
  const myLibrary = Koffi.load(dllPath);
  // const testFunction = myLibrary.func('testFunction', 'void', []);
  const setWindowLevelToDesktop = myLibrary.func('setWindowLevelToDesktop', 'void', ['int']);
  setWindowLevelToDesktop(handles)
}