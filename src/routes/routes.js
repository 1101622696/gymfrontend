import login from "../components/Login.vue"
import Clientes from "../components/Clientes.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const routes=[
{path:"/",component:login},
{path:"/Clientes",component:Clientes},
]
export const router=createRouter({
history:createWebHashHistory(),
routes
})