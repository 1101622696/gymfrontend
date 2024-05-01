import login from "../components/Login.vue"
import Clientes from "../components/Clientes.vue"
import Ingresos from "../components/ingresos.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"
import Clientes from "../components/Clientes.vue"

import { createRouter, createWebHashHistory } from "vue-router"

const routes=[
{path:"/",component:login},
{path:"/Clientes",component:Clientes},
{path:"/Ingresos",component:Ingresos},

]
export const router=createRouter({
history:createWebHashHistory(),
routes
})