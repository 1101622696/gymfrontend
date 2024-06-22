import { createApp } from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { Quasar, Notify} from 'quasar'
import router from "./routes/routes.js"
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'
import axios from "axios";
import Swal from 'sweetalert2';

// axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.baseURL = "https://gimnasio-ij9r.onrender.com";


let requestsPending = 0;

axios.interceptors.request.use((request) => {
  requestsPending ++;

if (requestsPending == 1) {
  Swal.fire({
    // title: 'Espere, por que si recarga, se peta esta weva...',
    didOpen: () => {
      Swal.showLoading();
    },
    allowOutsideClick: false,
    allowEscakey: false,
    allowEnterkey: false,
  });
}
return request;
});

axios.interceptors.response.use(
function (response){
  requestsPending--;

  if (requestsPending == 0){
    Swal.close();
  }
  return response;
},
function (error) {
requestsPending--;
if(requestsPending == 0) {
  Swal.close();
}

if (error.response.status == 401) {
 router .push('/')
}

return Promise.reject(error);
});

const pinia =createPinia()
pinia.use(piniaPluginPersistedstate)
const myApp = createApp(App)

myApp.use(Quasar,  {
  plugins: { Notify },
  config: {
    notify: {
      position: 'top',
      timeout: 2500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      color:"red"
    },
  },
})

myApp.use(router)

myApp.use(pinia)
myApp.mount('#app')