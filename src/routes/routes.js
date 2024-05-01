import login from "../components/login.vue"
import clientes from "../components/clientes.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const routes=[
{path:"/",component:login},
{path:"/clientes",component:clientes},
]
export const router=createRouter({
history:createWebHashHistory(),
routes
})