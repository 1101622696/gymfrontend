<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="custom-header text-black">
      <q-toolbar>
        <q-btn icon="menu" round flat dense @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://img.freepik.com/vector-premium/logotipo-fitness-levantamiento-pesas_609277-112.jpg" alt="Gimnasio Logo">
          </q-avatar>
          GIMNASIO
        </q-toolbar-title>
        <q-btn icon="logout" round flat dense @click="logout" />
      </q-toolbar>
      
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered class="bg-white-8" id="contedrawer">
<div class="usuario">
<div class="usuarion">{{ usuario }}</div>
 <div class="usuarior"> {{ role }}</div></div>

 <div class="separation"></div>

      <q-list>
        <q-item v-for="link in filteredLinks" :key="link.to" :to="link.to" clickable>
          <q-item-section avatar>
            <q-icon :name="link.icon" class="text-black" />
          </q-item-section>
          <q-item-section class="text-black text-body1">{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container @click="closeDrawer">
      <router-view @click="closeDrawer()" />
      <div class="casita" v-if="$route.path === '/Home'">
        <q-page class="pagina" style="background-image: url('https://wallpapers.com/images/hd/gym-motivation-poster-os5s90il3i3rxu85.jpg');">
          <div class="texto">
            <q-card class="cards">
              <q-card-section>
                <div class="text-h5 text-center text-white q-mb-none">"Una sonrisa y una buena actitud pueden cambiar el día de alguien."</div>
              </q-card-section>
            </q-card>
            <q-card class="cards">
              <q-card-section>
                <div class="text-h5 text-center text-white q-mb-none">"Recuerda que el éxito del equipo depende de cada uno de nosotros."</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="texto">
            <q-card class="cards">
              <q-card-section>
                <div class="text-h5 text-center text-white q-mb-none">Nuestra Misión</div>
                <div class="text-subtitle1 text-center text-white q-mt-xs">"Ofrecer un ambiente inclusivo y motivador donde todos nuestros clientes puedan alcanzar sus objetivos de salud y fitness."</div>
              </q-card-section>
            </q-card>
            <q-card class="cards">
              <q-card-section>
                <div class="text-h5 text-center text-white q-mb-none">Nuestra Visión</div>
                <div class="text-subtitle1 text-center text-white q-mt-xs">"Ser el gimnasio líder en la región, reconocido por nuestro compromiso con la salud y el bienestar de nuestros clientes."</div>
              </q-card-section>
            </q-card>
          </div>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStoreUsuarios } from '../store/usuarios';
import { useRouter } from 'vue-router';

const leftDrawerOpen = ref(false);
const { role } = useStoreUsuarios()
const router = useRouter();
const storeUsuarios = useStoreUsuarios();
const  usuario  =storeUsuarios.user.nombre

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};


const links = [
  { to: '/Home/clientes', label: 'Clientes', icon: 'people', roles: ['Administrador', 'Recepcionista', 'Entrenador'] },
  { to: '/Home/compras', label: 'Compras', icon: 'people', roles: ['Administrador'] },
  { to: '/Home/ingresos', label: 'Ingresos', icon: 'attach_money', roles: ['Administrador'] },
  { to: '/Home/inventario', label: 'Inventario', icon: 'inventory', roles: ['Administrador'] },
  { to: '/Home/mantenimiento', label: 'Mantenimiento', icon: 'build', roles: ['Administrador', 'Recepcionista'] },
  { to: '/Home/maquinas', label: 'Máquinas', icon: 'fitness_center', roles: ['Administrador'] },
  { to: '/Home/pagos', label: 'Pagos', icon: 'credit_card', roles: ['Administrador', 'Recepcionista'] },
  { to: '/Home/planes', label: 'Planes', icon: 'event_note', roles: ['Administrador'] },
  { to: '/Home/proveedores', label: 'Proveedores', icon: 'event_note', roles: ['Administrador'] },
  { to: '/Home/sedes', label: 'Sedes', icon: 'location_on', roles: ['Administrador'] },
  { to: '/Home/usuarios', label: 'Usuarios', icon: 'group', roles: ['Administrador'] },
  { to: '/Home/ventas', label: 'Ventas', icon: 'shopping_cart', roles: ['Administrador', 'Recepcionista'] }
];


const logout = () => {

      router.push('/');
   
      storeUsuarios.eliminarToken(); 
      console.log('Token eliminado y consola limpiada');
    };


const filteredLinks = computed(() => {
    return links.filter(link => link.roles.includes(role));
});

const closeDrawer = () => {
  leftDrawerOpen.value = false;
};
</script>

<style scoped>
.bg-primary {
  background-color: bisque;
}
.text-white {
  color: white;
}
.bg-cover {
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cards {
  width: 45%;
  margin: 0 auto;
  height: 15vmax;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  margin-top: 53%;
}
.card-image {
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  height: 150px;
  width: 150px;
  margin: 0 auto;
}
.q-mx-md {
  margin-left: 1em;
  margin-right: 1em;
}
.q-mb-none {
  margin-bottom: 0;
}
.q-mt-xs {
  margin-top: 0.5em;
}
.pagina {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-between;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.texto {
  display: flex;
  justify-content: space-around;
}

.usuario{
  display: flex;
  flex-direction: column;
  margin-left: 1vmin;
  gap: 1vmin;
  color: black;
  margin-top: 2vmin;
  /* margin-left: 3vmin; */
  margin-right: 3vmin;
  border-radius: 1vmin;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
width:auto;
height: auto;
padding: 1vmin;
padding-left: 2vmin;
}
.usuarion{
  font-size: x-large;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
}

.separation {
  margin-bottom: 3vmin; 
}


.custom-header {
    background-color: white !important; /* Cambia el fondo a blanco */
  }
</style>
