const ffi = require('ffi-napi');
const W32 = ffi.Library("user32", {
  // 检索顶级窗口的句柄，该顶级窗口的类名和窗口名与指定的字符串匹配。此功能不搜索子窗口。此功能不执行区分大小写的搜索。
  FindWindowW: ["int32", ["string", "string"]],
  // 将指定的消息发送到一个或多个窗口
  SendMessageTimeoutW: [
    "int32",
    ["int32", "int32", "int32", "int32", "int32", "int32", "int32"],
  ],
  // 通过将句柄传递给每个窗口，依次传递到应用程序定义的回调函数，可以枚举屏幕上所有的顶级窗口
  EnumWindows: ["bool", ["pointer", "int32"]],

  // 检索其类名和窗口名与指定字符串匹配的窗口的句柄。该功能搜索子窗口，从指定子窗口之后的子窗口开始。此功能不执行区分大小写的搜索。
  FindWindowExW: ["int32", ["int32", "int32", "string", "int32"]],

  // 更改指定子窗口的父窗口。
  SetParent: ["int32", ["int32", "int32"]],
  MessageBoxW: ["int32", ["int32", "string", "string", "int32"]],
  // 最小化（但不破坏）指定的窗口。
  CloseWindow: ["bool", ["int32"]],
  // 销毁指定的窗口
  DestroyWindow: ["bool", ["int32"]],
  // 打开指定的桌面对象
  OpenDesktopW: ["int32", ["string", "int32", "bool", "int32"]],
  // 确定指定窗口的可见性状态。
  IsWindowVisible: ["bool", ["int32"]],
  // 设置指定窗口的显示状态。
  ShowWindow: ["bool", ["int32", "int32"]],


  // 获取窗口的扩展样式
  GetWindowLongW: ["int32", ["int32", "int32"]],
  // 设置窗口的扩展样式
  SetWindowLongW: ["int32", ["int32", "int32", "int32"]],
  // 将窗口设置为前景窗口
  SetForegroundWindow: ["bool", ["int32"]],
  EnableWindow: ["bool", ["int32", "bool"]],
});
export default function setDynamicWallpaper(handlers) {
  if (handlers) {
   
    // 要触发在桌面图标和墙纸之间创建WorkerW窗口，我们必须向程序管理器发送一条消息。
    const progman = W32.FindWindowW(TEXT("Progman"), null);
    // 该消息是未记录的消息，因此没有专用的Windows API名称，除了0x052C
    W32.SendMessageTimeoutW(
      progman,
      0x052c, // 在程序管理器上生成墙纸工作程序的未记录消息
      0,
      0,
      0x0000,
      1000,
      0
    );
    // 我们枚举所有Windows
    W32.EnumWindows(
      ffi.Callback("bool", ["int32", "int32"], (tophandle) => {
        // 找到一个具有SHELLDLL_DefView的Windows
        const SHELLDLL_DefView = W32.FindWindowExW(
          tophandle,
          0,
          TEXT("SHELLDLL_DefView"),
          0
        );
        if (SHELLDLL_DefView !== 0) {
          // 将其下一个同级分配给workerw。
          const workerw = W32.FindWindowExW(0, tophandle, TEXT("WorkerW"), 0);
          const isVisible = W32.IsWindowVisible(workerw);
          if (isVisible) {
            // 设置窗口为未激活状态，否则这个窗口会遮挡视频
            W32.ShowWindow(workerw, 0);
          }
          W32.SetParent(handlers, progman);

        }
        return true;
      }),
      0
    );
    
  }
  return false;
}
function TEXT(text) {
  return Buffer.from(`${text}\0`, "ucs2");
}

