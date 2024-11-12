import { ref } from "vue";
import { useMessageStore } from '@renderer/stores/messageStore'
import pinia from "@renderer/stores/pinia";
const messageStore = useMessageStore(pinia);
let favoriteAll = ref(JSON.parse(localStorage.getItem('favorite') as any)) || {}
// 新增分类
export function addCategory(categoryName){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    let isNoSameName = true;
    for(let i = 0; i < favoriteAll.value.length; i++){
        if(favoriteAll.value[i].categoryName === categoryName){
            isNoSameName = false
        }
    }
    if(isNoSameName){
        favoriteAll.value.push({categoryName:categoryName,imgList:[]})
        localStorage.setItem('favorite',JSON.stringify(favoriteAll.value))
        return true
    }else{
        return false
    }
}
// 删除分类
export function delCategory(categoryName){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    favoriteAll.value = favoriteAll.value.filter((item) => {
       return item.categoryName !== categoryName
    })
    localStorage.setItem('favorite',JSON.stringify(favoriteAll.value))
    return true
}
// 新增收藏
export function addFavorite(imgInfo,categoryName = '默认收藏'){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    for(let i = 0; i < favoriteAll.value.length; i++){
        if(favoriteAll.value[i].categoryName == categoryName){
            favoriteAll.value[i].imgList.push(imgInfo)
        }
    }
    localStorage.setItem('favorite',JSON.stringify(favoriteAll.value))
    return true
}
// 从本地导入时，格式化文件内容并保存至对应的收藏夹
export function insertLocalImageToFavorite(imageUrl,categoryName){
    // '/Users/huang/Downloads/pow-pow-jinx-desktop-7w8wu4y734gpkwoy.jpg'
    let imageInfo = {
        url:'file://'+imageUrl,
        tag:'本地图片：'+ imageUrl.slice(imageUrl.lastIndexOf('/') + 1,imageUrl.length),
        id:Date.now()+Math.random()*(10000-99999)+99999,
        local:true
    }
    addFavorite(imageInfo,categoryName)
}
// 取消收藏
export function delFavorite(imgInfo){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    for(let i = 0; i < favoriteAll.value.length; i++){
            favoriteAll.value[i].imgList = favoriteAll.value[i].imgList.filter((item) => {
                return item.id !== imgInfo.id
        })
    }
    localStorage.setItem('favorite',JSON.stringify(favoriteAll.value))
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    // 通知收藏夹刷新
    messageStore.updateDelState(true)
    ElMessage({message:"已取消收藏",type:"success"})
    return true
}
// 清空收藏夹内容
export function cleanFavorite(categoryName){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    for(let i = 0; i < favoriteAll.value.length; i++){
        if(favoriteAll.value[i].categoryName == categoryName){
            favoriteAll.value[i].imgList = []
            localStorage.setItem('favorite',JSON.stringify(favoriteAll.value))
            return true
        }
    }
    return false
}
// 判断是否已经收藏
export function isFavorited(imgInfo){
    for(let i = 0; i < favoriteAll.value.length; i++){
        for(let j = 0; j < favoriteAll.value[i].imgList.length; j++){
            if(favoriteAll.value[i].imgList[j].id == imgInfo.id){
                return true
            }
        }
    }
    return false
}