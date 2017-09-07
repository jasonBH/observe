import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Home from '@/module/home/Home.vue'//主页



export default new Router({
    routes: [
        {
            path: '/',
            component:Home
        },
    ]
})
