import { ref } from "vue";
let favoriteAll = ref(JSON.parse(localStorage.getItem('favorite') as any))
export function getFavorite(){
    return favoriteAll.value ? favoriteAll.value: false
}
// 获取分类列表
export function getCategory(){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    let categoryList:any = []
    for(let i = 0; i < favoriteAll.value.length;i++){
        categoryList.push(favoriteAll.value[i].categoryName)
    }
    return categoryList
}
// 根据分类列表获取分类信息
export function getImgListByCategory(categoryName){
    favoriteAll.value = JSON.parse(localStorage.getItem('favorite') as any)
    for(let i = 0; i < favoriteAll.value.length;i++){
        if(categoryName == favoriteAll.value[i].categoryName){
            return favoriteAll.value[i].imgList
        }
    }
    return []
}