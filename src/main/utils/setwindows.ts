const edge = require('electron-edge-js');
export default function setWindowsWallPaper(filepath) {
    // 定义调用 C++ DLL 的函数
    const setWallpaper = edge.func({
        assemblyFile: '../dll/libwalls.dll', // DLL 的路径
        methodName: 'setWallpaper' // 要调用的函数名称
    });
    // 调用 DLL 函数
    setWallpaper(filepath, function (error, _result) {
        if (error) return false;
        return true
    });
}

