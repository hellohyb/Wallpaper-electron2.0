const fs = require('fs')
const http = require('http')
const path = require('path')
import getDefaultDirectory from "./getDefaultDirectory"
// 新建文件夹
export function mkdirsSync (dirname) {
  // 判断文件夹是否存在
    if (fs.existsSync(dirname)) {
      return true;
    }else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
    return false
}

// 下载图片
export async function downloadWallpaper(imgUrl,dirname = null){
    const dirname_ok = dirname == null ? await getDefaultDirectory() : dirname
    // 通过图片路径截取图片名
    const fileName = imgUrl.slice(imgUrl.lastIndexOf('/') + 1,imgUrl.lastIndexOf('.') - 1) + '.jpg'
    if(dirname_ok && mkdirsSync(dirname_ok)){
      // 下载文件
      return new Promise((resolve, _reject) => {
        http.get(imgUrl,(res) => {
          const fileStream = fs.createWriteStream(`${dirname_ok}/${fileName}`)
          res.pipe(fileStream).on("close",() => {
            resolve(`${dirname_ok}/${fileName}`)
          })
      })
      })
    }else{
      return false
    }
}