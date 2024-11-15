// 防抖：快速多次触发函数时，会清除前面的触发事件，只执行最后一次
export function debounce(func: (...args: any[]) => Promise<any> | void, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    if (timeout) {
      clearTimeout(timeout); // 清除之前的定时器
    }
    timeout = setTimeout(async () => {
      await func(...args);  // 执行异步操作
    }, delay);
  };
}



// 节流：限制事件触发的频率，确保在每个 delay 时间间隔内至少执行一次。
export function throttle(func, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    // 如果距离上次执行的时间超过了 delay，则执行 func
    if (now - lastTime >= delay) {
      func(...args);
      lastTime = now; // 更新 lastTime 为当前时间
    }
  };
}
