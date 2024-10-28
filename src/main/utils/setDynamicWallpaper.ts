const ffi = require('ffi-napi');
const ref = require('ref-napi');

// 引用 Windows API
const user32 = ffi.Library('user32', {
  'FindWindowW': ['int32', ['string', 'string']],
  'FindWindowExW': ['int32', ['int32', 'int32', 'string', 'string']],
  'SetParent': ['int32', ['int32', 'int32']],
  'SendMessageTimeoutW': ['int32', ['int32', 'uint32', 'int32', 'int32', 'uint32', 'uint32', 'int32']]
});

export default function setDynamicWallpaper(winHandle) {
  const progman = user32.FindWindowW('Progman', null);
  // 发送消息创建 WorkerW 窗口
  user32.SendMessageTimeoutW(progman, 0x052C, 0, 0, 0, 1000, 0);
  // 查找新创建的 WorkerW 窗口
  const workerw = user32.FindWindowExW(0, progman, 'WorkerW', null);
  // 将 Electron 窗口嵌入到 WorkerW 窗口中
  user32.SetParent(winHandle, workerw);
}