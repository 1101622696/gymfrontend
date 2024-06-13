<template>
  <div class="todo">
    <div class="body">
      <section>
        <form @submit.prevent="iniciar">
          <h1>Inicio</h1>
          <div class="inputbox">
            <input type="email" required v-model="email" />
            <label for="">Usuario</label>
          </div>
          <div class="inputbox password-box">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input :type="passwordFieldType" required v-model="passwordLogin" />
            <label for="">Contraseña</label>
            <ion-icon :name="eyeIcon" @click="togglePasswordVisibility"></ion-icon>
          </div>
          <button type="submit">Iniciar</button>
          <div class="register"></div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStoreUsuarios } from '../store/usuarios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const UseUsuario = useStoreUsuarios();
const email = ref('');
const passwordLogin = ref('');
const passwordVisible = ref(false);
const $q = useQuasar();

const passwordFieldType = computed(() => (passwordVisible.value ? 'text' : 'password'));
const eyeIcon = computed(() => (passwordVisible.value ? 'eye-off-outline' : 'eye-outline'));

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const mostrarMensajeError = (mensaje) => {
  $q.notify({
    type: 'negative',
    message: mensaje,
    position: 'bottom-right',
  });
};

const mostrarMensajeExito = (mensaje) => {
  $q.notify({
    type: 'positive',
    message: mensaje,
    position: 'bottom-right',
  });
};

const iniciar = async () => {
  try {
    if (email.value === '' || passwordLogin.value === '') {
      mostrarMensajeError('El correo electrónico y la contraseña son obligatorios');
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email.value)) {
      mostrarMensajeError('Correo electrónico o contraseña incorrectos');
      return;
    }

    const res = await UseUsuario.login(email.value, passwordLogin.value);
    
    if (res.data.token) {
      mostrarMensajeExito('Inicio de sesión exitoso');
      console.log(`Este es el token: ${UseUsuario.token}`);
      router.push('/Home');
    } else {
      mostrarMensajeError('Correo electrónico o contraseña incorrectos');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      mostrarMensajeError(error.response.data.msg);
    } else {
      mostrarMensajeError('Ha ocurrido un error en el servidor');
      console.log(error);
    }
  }
};
</script>


<style scoped>
.todo {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "poppins" sans-serif;
}

.password-box {
  position: relative;
}

.password-box ion-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 2;
}
.password-box ion-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 2;
}
.body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url("https://preview.free3d.com/img/2016/04/1725656089682248848/2k6yk897.jpg")
    no-repeat center;
  /* background-color: grey;*/
  background-size: cover;
}
section {
  position: relative;
  max-width: 400px;
  background-color: transparent;
  border: 2px solid rgb(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(55px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
}

.inputbox input {
  width: 100%;
  height: 60px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0 35px 0 5px;
  color: #fff;
}

.inputbox ion-icon {
  position: absolute;
  right: 8px;
  color: #fff;
  font-size: 1.2rem;
  top: 20px;
}

.forget {
  margin: 35px 0;
  font-size: 0.85rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
}

h1 {
  font-size: 2rem;
  color: #fff;
  text-align: center;
}
.inputbox {
  position: relative;
  margin: 30px 0;
  max-width: 310px;
  border-bottom: 2px solid #fff;
}
.inputbox label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  color: #fff;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.5s ease-in-out;
}
input:focus ~ label,
input:valid ~ label {
  top: -5px;
}

.forget label {
  display: flex;
  align-items: center;
}
.forget label input {
  margin-right: 3px;
}
.forget a {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
.forget a:hover {
  text-decoration: underline;
}

button {
  width: 100%;
  height: 40px;
  border-radius: 40px;
  background-color: rgb(255, 255, 255, 1);
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.4s ease;
}
button:hover {
  background-color: rgb(255, 255, 255, 0.5);
}
.register {
  font-size: 0.9rem;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.register p a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}
.register p a:hover {
  text-decoration: underline;
}
</style>
