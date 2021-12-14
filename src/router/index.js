import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from "../views/HelloWorld";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    },
    {
        path: '/wheel',
        name: 'Wheel',
        component: () => import("../views/Wheel.vue"),
    },
    {
        path: '/gift-wrapping',
        name: 'GiftWrapping',
        component: () => import("../views/GiftWrapping.vue"),
    },
    {
        path: "/graham-scan",
        name: "GrahamScan",
        component: () => import("../views/GrahamScan.vue"),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
