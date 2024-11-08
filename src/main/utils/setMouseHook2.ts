
const koffi = require('koffi');
// 定义钩子类型
const WH_MOUSE = 7;
const lib = koffi.load('user32.dll');
const callbackProto = koffi.proto('__stdcall', 'callbackProto', 'long', ['int', 'int', 'int']);
const user32 = {
    SetWindowsHookExW: lib.func('SetWindowsHookExW','long', [ 'int', koffi.pointer(callbackProto), 'long', 'int' ]),
    CallNextHookEx: lib.func('CallNextHookEx','long', [ 'long', 'int', 'int', 'int' ]),
    SendMessageW: lib.func('SendMessageW','int', [ 'int', 'int', 'int', 'int' ]),
    UnhookWindowsHookEx: lib.func('UnhookWindowsHookEx','bool', [ 'long' ])
}
let hook
export function SetMouseHook2(handlers){
    if(handlers){
        // 钩子回调函数
        const mouseHookCallback = ((nCode, wParam, lParam) => {
            if (nCode >= 0) {
                // 处理鼠标事件，例如发送到指定窗口
                user32.SendMessageW(handlers, wParam, lParam, 0);
            }
            return user32.CallNextHookEx(0, nCode, wParam, lParam);
        });
        // 设置钩子
        console.log(handlers);
        
        hook = user32.SetWindowsHookExW(WH_MOUSE, mouseHookCallback, 0, 0);
    }
}

export function UnhookWindowsHookEx(){
    user32.UnhookWindowsHookEx(hook);
}
