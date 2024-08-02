<template>
 <!-- <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://img.freepik.com/vector-premium/logotipo-fitness-levantamiento-pesas_609277-112.jpg" alt="Gimnasio Logo">
          </q-avatar>
          GIMNASIO
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <q-list>
        <q-item to="/" clickable>
          <q-item-section avatar>
            <q-icon name="login" />
          </q-item-section>
          <q-item-section>Login</q-item-section>
        </q-item>
        <q-item to="/Home/clientes" clickable>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>Clientes</q-item-section>
        </q-item>
        <q-item to="/Home/ingresos" clickable>
          <q-item-section avatar>
            <q-icon name="attach_money" />
          </q-item-section>
          <q-item-section>Ingresos</q-item-section>
        </q-item>
        <q-item to="/Home/inventario" clickable>
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section>Inventario</q-item-section>
        </q-item>
        <q-item to="/Home/mantenimiento" clickable>
          <q-item-section avatar>
            <q-icon name="build" />
          </q-item-section>
          <q-item-section>Mantenimiento</q-item-section>
        </q-item>
        <q-item to="/Home/maquinas" clickable>
          <q-item-section avatar>
            <q-icon name="fitness_center" />
          </q-item-section>
          <q-item-section>Máquinas</q-item-section>
        </q-item>
        <q-item to="/Home/pagos" clickable>
          <q-item-section avatar>
            <q-icon name="credit_card" />
          </q-item-section>
          <q-item-section>Pagos</q-item-section>
        </q-item>
        <q-item to="/Home/planes" clickable>
          <q-item-section avatar>
            <q-icon name="event_note" />
          </q-item-section>
          <q-item-section>Planes</q-item-section>
        </q-item>
        <q-item to="/Home/sedes" clickable>
          <q-item-section avatar>
            <q-icon name="location_on" />
          </q-item-section>
          <q-item-section>Sedes</q-item-section>
        </q-item>
        <q-item to="/Home/usuarios" clickable>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>
        <q-item to="/Home/ventas" clickable>
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>Ventas</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view /> 
      <div class="casita">
      
      </div>
    </q-page-container>
  </q-layout> -->
  <div id="#app">
  </div>
  <router-view>
  </router-view>
</template> 

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: bisque;
}

.text-white {
  color: white;
}
</style>
*/






