import { createRouter, createWebHashHistory } from "vue-router";
import { useStoreUsuarios } from '../store/usuarios';

import Login from "../components/Login.vue";
import isAllowed from "../components/Home.vue";
import Home from "../components/Home.vue";
import Clientes from "../components/Clientes.vue";
import Ingresos from "../components/Ingresos.vue";
import Inventario from "../components/Inventario.vue";
import Mantenimiento from "../components/Mantenimiento.vue";
import Maquinas from "../components/Maquinas.vue";
import Pagos from "../components/Pagos.vue";
import Planes from "../components/Planes.vue";
import Sedes from "../components/Sedes.vue";
import Usuarios from "../components/Usuarios.vue";
import Ventas from "../components/Ventas.vue";
import Rescontrasena from "../components/Rescontrasena.vue";
import axios from "axios";



const routes = [
  { path: "/", component: Login },
  { path: "/Rescontrasena", component: Rescontrasena},
  { 
    path: "/Home", 
    component: Home,
    children: [
      { path: "Clientes", component: Clientes, meta: { roles: ['Administrador', 'Recepcionista', 'Entrenador'] } },
      { path: "Ingresos", component: Ingresos, meta: { roles: ['Administrador'] } },
      { path: "Inventario", component: Inventario, meta: { roles: ['Administrador'] } },
      { path: "Mantenimiento", component: Mantenimiento, meta: { roles: ['Administrador', 'Recepcionista'] } },
      { path: "Maquinas", component: Maquinas, meta: { roles: ['Administrador'] } },
      { path: "Pagos", component: Pagos, meta: { roles: ['Administrador', 'Recepcionista'] } },
      { path: "Planes", component: Planes, meta: { roles: ['Administrador'] } },
      { path: "Sedes", component: Sedes, meta: { roles: ['Administrador'] } },
      { path: "Usuarios", component: Usuarios, meta: { roles: ['Administrador'] } },
      { path: "Ventas", component: Ventas, meta: { roles: ['Administrador', 'Recepcionista'] } },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const useUsuario = useStoreUsuarios();
  const userRole = useUsuario.role;

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/');
  } else {
    next();
  }
});

export default router;
