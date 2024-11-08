import axios from 'axios'
// 开发环境与生产环境请求地址切换
let url = process.env.NODE_ENV == 'development' ? '/api' : 'http://wp.birdpaper.com.cn/intf'
// 获取分类信息
export function getCategory(){
    return axios({
      url:`${url}/getCategory`,
      method:'get'
    })
}

// 根据id获取分类详情(id,页数)
export function getListByCategory(cids:number, pageno:number, count) {
  return axios({
    url:`${url}/GetListByCategory?cids=${cids}&pageno=${pageno}&count=${count}`,
    method:'get',
    headers:{
      'Content-Type': 'application/json', 
        "Accept-Control-Allow-Origin":"*"
    }
  })
}

// 搜索壁纸
export function searchWallpaper(key,pageno) {
  return axios({
    url:`${url}/search?content=${key}&pageno=${pageno}&count=1000`,
    method:'get',
    headers:{
      'Content-Type': 'application/json', 
        "Accept-Control-Allow-Origin":"*"
    }
  })
}

// 最新壁纸
export function getNewList(pageNo,count) {
  return axios({
    url:`${url}/newestList?pageno=${pageNo}&count=${count}`,
    method:'get',
    headers:{
      'Content-Type': 'application/json', 
        "Accept-Control-Allow-Origin":"*"
    }
  })
}

// bing每日壁纸
export function getBingWallpaper(count){
  return axios.get(`https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=${count}&mkt=zh-CN`)
}