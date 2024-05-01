
<template>
  <q-layout view="lHh lpR fFf">

    <q-header class="bg-grey-10 text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          GIMNASIO
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="login" />
        <q-route-tab to="/clientes" label="clientes" />
        <q-route-tab to="/ingresos" label="ingresos" />
        <q-route-tab to="/inventario" label="inventario" />
        <q-route-tab to="/mantenimiento" label="mantenimiento" />
        <q-route-tab to="/maquinas" label="maquinas" />
        <q-route-tab to="/pagos" label="pagos" />
        <q-route-tab to="/planes" label="planes" />
        <q-route-tab to="/sedes" label="sedes" />
        <q-route-tab to="/usuarios" label="usuarios" />
        <q-route-tab to="/ventas" label="ventas" />


      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left">
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
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

.bg-primary text-white{
background-color: bisque;
}

</style>