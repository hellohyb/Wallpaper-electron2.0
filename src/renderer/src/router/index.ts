import { createRouter,createWebHashHistory } from "vue-router"
import homeVue from "@renderer/views/Home.vue"
import WallpaperVue from "@renderer/views/Wallpaper.vue"
import FavoriteVue from "@renderer/views/Favorite.vue"
import SearchVue from "@renderer/views/Search.vue"
import Video from "@renderer/views/Video.vue"
import Ai from "@renderer/views/Ai.vue"
import More from "@renderer/views/More/index.vue"
import Setting from "@renderer/views/More/setting.vue"
import About from "@renderer/views/More/about.vue"
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
    },
    {
        path:'/ai',
        name:'ai',
        component:Ai,
    },
    {
        path:'/more',
        component:More,
        name:'more',
        redirect:'/more/setting',
        children:[
            {
                path:'/more/setting',
                name:'more1',
                component:Setting
            },
            {
                path:'/more/about',
                name:'more2',
                component:About
            },
        ]
    }
]
const router = createRouter({
    history:createWebHashHistory(import.meta.env.BASE_URL),
    routes
})
export default router