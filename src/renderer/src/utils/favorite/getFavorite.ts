import { ref } from "vue";
const electronStore = window.electronStore
let favoriteAll = ref(electronStore.get('favorite'))
export function getFavorite(){
    return favoriteAll.value ? favoriteAll.value: false
}
// 获取分类列表
export function getCategory(){
    favoriteAll.value = electronStore.get('favorite')
    let categoryList:any = []
    for(let i = 0; i < favoriteAll.value.length;i++){
        categoryList.push(favoriteAll.value[i].categoryName)
    }
    return categoryList
}
// 根据分类列表获取分类信息
export function getImgListByCategory(categoryName){
    favoriteAll.value = electronStore.get('favorite')
    for(let i = 0; i < favoriteAll.value.length;i++){
        if(categoryName == favoriteAll.value[i].categoryName){
            return favoriteAll.value[i].imgList
        }
    }
    return []
}