import axios from 'axios'
// 开发环境与生产环境请求地址切换
// let url = process.env.NODE_ENV == 'development' ? '/api' : 'http://wp.birdpaper.com.cn/intf/'
// 1、创建axios对象
const instance = axios.create({
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': '*/*', 
 },
})
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance;