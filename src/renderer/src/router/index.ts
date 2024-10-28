import { createRouter,createWebHashHistory } from "vue-router"
import homeVue from "@renderer/views/Home.vue"
import WallpaperVue from "@renderer/views/Wallpaper.vue"
import FavoriteVue from "@renderer/views/Favorite.vue"
import SearchVue from "@renderer/views/Search.vue"
import Video from "@renderer/views/Video.vue"
const routes = [
    {
        path:'/',
        name:'home',
        component:homeVue
    },
    {
        path:'/wallpaper',
        name:'wallpaper',
        component:WallpaperVue,
        meta:{
            name:'wapplaper',
            keepAlive:true
        }
    },
    {
        path:'/favorite',
        name:'favorite',
        component:FavoriteVue
    },
    {
        path:'/search',
        name:'search',
        component:SearchVue,
        meta:{
            name:'search',
            keepAlive:true
        }
    },
    {
        path:'/video',
        name:'video',
        component:Video,
    }
]
const router = createRouter({
    history:createWebHashHistory(import.meta.env.BASE_URL),
    routes
})
export default router