export default async function randWallpaper(mainWindow){
    const pageNo = Math.floor(Math.random() * 10) + 1;
    const countNo = Math.floor(Math.random() * 10) + 1;
    const No = Math.floor(Math.random() * countNo) + 1;
    mainWindow.webContents.send('getRandImgUrl',{pageNo,countNo,No})
}