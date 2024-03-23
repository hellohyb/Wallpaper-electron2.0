import getDefaultDirectory from "./getDefaultDirectory";
const fs = require('fs');
// 读取文件夹下的所有文件
export default async function getLocalWallpaper(dirPath = null){
    const dirPaths = dirPath == null ? await getDefaultDirectory() : dirPath
    let files = fs.readdirSync(dirPaths)
    let newFiles:any = []
    for(let i = 0; i < files.length; i++){
        if(files[i].includes('.jpg')){
            newFiles.push(
                {
                    tag:files[i].slice(files[i].lastIndexOf('-') + 1,files[i].length),
                    url:await getFileBlob(`${dirPaths}/${files[i]}`)
                }
            )
        }
    }
    return newFiles
}

// 图片转blob
async function getFileBlob(url){
    let blobUrl = '' 
   await fetch(url).then(res => res.blob())
    .then(blob => {
        blobUrl = URL.createObjectURL(blob)
    })
    return blobUrl
}