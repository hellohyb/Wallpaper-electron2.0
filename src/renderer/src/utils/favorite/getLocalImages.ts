const fs = require('fs');
const path = require('path');

// 判断文件是否为图片的辅助函数
function isImageFile(fileName) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp'];
    const ext = path.extname(fileName).toLowerCase();
    return imageExtensions.includes(ext);
}

// 遍历文件夹并筛选图片文件
export default function getImageFilesFromFolder(folderPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                reject(`Error reading folder: ${err}`);
                return;
            }
            
            // 筛选出图片文件
            const imageFiles = files
                .filter(file => isImageFile(file))  // 筛选图片文件
                .map(file => path.join(folderPath, file)); // 生成完整路径
            
            resolve(imageFiles);
        });
    });
}
