import Login from "../components/Login.vue"
import Clientes from "../components/Clientes.vue"
import Ingresos from "../components/Ingresos.vue"
import Inventario from "../components/Inventario.vue"
import Mantenimiento from "../components/Mantenimiento.vue"
import Maquinas from "../components/Maquinas.vue"
import Pagos from "../components/Pagos.vue"
import Planes from "../components/Planes.vue"
import Sedes from "../components/Sedes.vue"
import Usuarios from "../components/Usuarios.vue"
import Ventas from "../components/Ventas.vue"
// import Home from "../components/Home.vue"



import { createRouter, createWebHashHistory } from "vue-router"

const routes=[
{path:"/",component:Login},
{path:"/Clientes",component:Clientes},
{path:"/Ingresos",component:Ingresos},
{path:"/Inventario",component:Inventario},
{path:"/Mantenimiento",component:Mantenimiento},
{path:"/Maquinas",component:Maquinas},
{path:"/Pagos",component:Pagos},
{path:"/Planes",component:Planes},
{path:"/Sedes",component:Sedes},
{path:"/Usuarios",component:Usuarios},
{path:"/Ventas",component:Ventas},
// {path:"/Home",component:Home},



]
export const router=createRouter({
history:createWebHashHistory(),
routes
})