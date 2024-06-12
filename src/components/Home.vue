<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-grey-8 text-white">
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

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered class="bg-grey-8" >
      <q-list>

        <q-item to="/" clickable>
          <q-item-section avatar>
        <q-icon name="login" class="text-white" />
      </q-item-section>
      <q-item-section class="text-white text-body1">Cerrar sesión</q-item-section>
    </q-item>


        <q-item to="/Home/clientes" clickable>
          <q-item-section avatar>
            <q-icon name="people" class="text-white" />
          </q-item-section>
          <q-item-section class="text-white text-body1">Clientes</q-item-section>
        </q-item>
        <q-item to="/Home/ingresos" clickable>
          <q-item-section avatar>
            <q-icon name="attach_money" class="text-white" />
          </q-item-section>
          <q-item-section class="text-white text-body1">Ingresos</q-item-section>
        </q-item>
        <q-item to="/Home/inventario" clickable>
          <q-item-section avatar>
            <q-icon name="inventory"  class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Inventario</q-item-section>
        </q-item>
        <q-item to="/Home/mantenimiento" clickable>
          <q-item-section avatar>
            <q-icon name="build" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Mantenimiento</q-item-section>
        </q-item>
        <q-item to="/Home/maquinas" clickable>
          <q-item-section avatar>
            <q-icon name="fitness_center" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Máquinas</q-item-section>
        </q-item>
        <q-item to="/Home/pagos" clickable>
          <q-item-section avatar>
            <q-icon name="credit_card" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Pagos</q-item-section>
        </q-item>
        <q-item to="/Home/planes" clickable>
          <q-item-section avatar>
            <q-icon name="event_note" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Planes</q-item-section>
        </q-item>
        <q-item to="/Home/sedes" clickable>
          <q-item-section avatar>
            <q-icon name="location_on" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Sedes</q-item-section>
        </q-item>
        <q-item to="/Home/usuarios" clickable>
          <q-item-section avatar>
            <q-icon name="person" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Usuarios</q-item-section>
        </q-item>
        <q-item to="/Home/ventas" clickable>
          <q-item-section avatar>
            <q-icon name="shopping_cart" class="text-white"/>
          </q-item-section>
          <q-item-section class="text-white text-body1">Ventas</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container @click="closeDrawer">
      
       <router-view @click="closeDrawer()"> </router-view>
      <div class="casita"  v-if="$route.path === '/Home'">
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

<script>
import { ref,} from 'vue';

export default {
  
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const closeDrawer = () => {
      leftDrawerOpen.value = false;
    };

  
    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      closeDrawer
    };
  },
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

.text-white {
  color: white;
}

.q-mb-none {
  margin-bottom: 0;
}

.q-mt-xs {
  margin-top: 0.5em;
}
.pagina{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-between;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.texto{
  display: flex;
  justify-content:space-around;
}

</style>

