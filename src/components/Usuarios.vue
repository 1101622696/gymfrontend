<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreUsuarios } from "../store/usuarios.js";
import { useStoreSedes } from "../store/sedes.js";
import { useQuasar } from 'quasar'


const useUsuarios = useStoreUsuarios();
const useSedes = useStoreSedes();
const $q = useQuasar();


let alert = ref(false)
let accion = ref(1)

function abrir(){
  accion.value=1
  alert.value = true;

idSede.value=""
nombre.value=""
email.value=""
telefono.value=""
password.value=""
rol.value=""

}


// async function guardar(){

// alert.value = false;
// if (await validar()){
//   const todo={
//     idSede:idSede.value.valor,
//     nombre:nombre.value,
//     email:email.value,
//     telefono:telefono.value,
//     password:password.value,
//     rol:rol.value
//     }
// let nombrez= await useUsuarios.postUsuario(todo)
// if(nombrez.status!=200){
//   mostrarMensajeError("no se pudo enviar")
// }else{
//   mostrarMensajeExito("muy bien")
//   listarUsuarios(), listarSedes();
// }
// }
// }
function guardarUltimoUsuario(id) {
  localStorage.setItem('ultimoUsuario', id);
}

function obtenerUltimoUsuario() {
  return localStorage.getItem('ultimoUsuario');
}
async function guardar() {
  alert.value = false;

  if (await validar()) {
    const todo = {
      idSede: idSede.value.valor,
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value,
      password: password.value,
      rol: rol.value
    };

    try {
      let nombrez = await useUsuarios.postUsuario(todo);

      if (nombrez.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
      } else {
        const nuevoUsuario = {
          _id: nombrez.data.usuario._id, // Asumiendo que el backend devuelve un _id
          idSede: nombrez.data.usuario.idSede,
          nombre: nombrez.data.usuario.nombre,
          email: nombrez.data.usuario.email,
          telefono: nombrez.data.usuario.telefono,
          rol: nombrez.data.usuario.rol,
          // ... otros campos que puedas necesitar
        };

        // Guardar el ID del nuevo usuario en localStorage
        guardarUltimoUsuario(nuevoUsuario._id);

        // Añadir el nuevo usuario al principio del array
        rows.value.unshift(nuevoUsuario);

        mostrarMensajeExito("Usuario agregado exitosamente");
        listarUsuarios();
        listarSedes();
  alert.value = false;

      }
    } catch (error) {
      mostrarMensajeError("Error al enviar la solicitud: " + error.message);
    }
  }
}

function editar(info) {
  alert.value = true;
  accion.value = 2;

  informacion.value = info;
  idSede.value = info.idSede; 
  nombre.value = info.nombre;
  email.value = info.email;
  telefono.value = info.telefono;
  password.value = info.password;
  rol.value = info.rol; 
}



async function editarusuario() {
  if (await validar()) {
    const todo = {
      idSede: idSede.value.valor,
      nombre: nombre.value,
      email: email.value,
      telefono: telefono.value,
      password: password.value,
      rol: rol.value 
    };

    try {
      const response = await useUsuarios.putUsuarios(informacion.value._id, todo);
      if (response.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
      } else {
        mostrarMensajeExito("Muy bien");
        listarUsuarios();
        listarSedes();
  alert.value = false;

      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      mostrarMensajeError("No se pudo enviar");
    }
  }
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useUsuarios.putDesactivarUsuario(info._id)
}else if(info.estado == 0){
let activado= await useUsuarios.putActivarUsuario(info._id)
}
 listarUsuarios();
}



onMounted(()=>{
  listarUsuarios(), listarSedes();
})

let informacion=ref("")
let idSede = ref("");
let nombre = ref("");
let email = ref("");
let telefono = ref("");
let password = ref("");
let rol = ref("");
let sedesTodo = ref([]);
let nombreCodigo = ref([]);

let rows=ref([])
let columns =ref([
      {name:"idSede", label:"Sede", field:"idSede", align:"center"},
  {name:"nombre", label:"Nombre de Usuario", field:"nombre", align:"center"},
    {name:"email", label:"Correo electrónico", field:"email", align:"center"},
    {name:"telefono", label:"Telefono", field:"telefono", align:"center"},
    {name:"rol", label:"Rol", field:"rol", align:"center"},
    {name:"estado", label:"Estado de Usuario", field:"estado", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
async function validar() {
    let verificado = true;

    if (nombre.value === "") {
        mostrarMensajeError("El nombre está vacío");
        verificado = false;
    }
    if (idSede.value === "") {
        mostrarMensajeError("Seleccione una sede");
        verificado = false;
    }
    if (email.value === "" || !validarEmail(email.value)) {
        mostrarMensajeError("El email no es válido");
        verificado = false;
    }
    
    if (telefono.value === "" || isNaN(telefono.value) || telefono.value.length < 10) {
        mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
        verificado = false;
    }
    if (rol.value === "") {
        mostrarMensajeError("Debe seleccionar un rol");
        verificado = false;
    }

    if (verificado) {
        mostrarMensajeExito("El formulario se envió correctamente");
    }

    return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
}


function cerrar() {
alert.value = false;
}  

      const model = ref(null);
      const options = [
        'Administrador', 'Recepcionista', 'Entrenador'
      ];


// async function listarUsuarios() {
//   try {
//     const res = await useUsuarios.listarUsuario();
//     rows.value = res.data.usuario.map(usuario => {
//       return {
//         ...usuario,
//         sede: usuario.id, 
//       };
//     });
//   } catch (error) {
//     console.error("Error al listar usuarios:", error);
//   }
// }
async function listarUsuarios() {
  try {
    const res = await useUsuarios.listarUsuario();
    const ultimoUsuarioId = obtenerUltimoUsuario();

    if (res && res.data && res.data.usuario) {
      rows.value = res.data.usuario.map(usuario => ({
        ...usuario,
        sede: usuario.id, 
      }));

      // Ordenar los usuarios poniendo el último usuario agregado primero
      rows.value.sort((a, b) => {
        if (a._id === ultimoUsuarioId) return -1;
        if (b._id === ultimoUsuarioId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra el último usuario
      });

      console.log("Usuarios ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar usuarios:", error);
  }
}

function getSedeNombre(id) {
  const sede = sedesTodo.value.find(sede => sede._id === id);
  return sede ? sede.nombre : '';
}

// const organizarSedes = computed(() => {
//     nombreCodigo.value = sedesTodo.value.map((element) => ({
//         label: `${element.nombre}`,
//         valor: `${element._id}`,
//         nombre: `${element.nombre}`,
//     }));
//     return nombreCodigo.value;
// });
const organizarSedes = computed(() => {
  nombreCodigo.value = sedesTodo.value.map((element) => ({
    label: `${element.nombre}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
  return nombreCodigo.value;
});


async function listarSedes() {
    try {
   const res = await useSedes.listarSede()
    console.log(res.data);
    sedesTodo.value=res.data.sede

    } catch (error) {
        console.error("Error al listar sedes:", error);
    }
}

// const opcioneslistar = computed(() => {
//     nombreCodigo.value = sedesTodo.value.map((element) => ({
//         label: `${element.nombre}`,
//         valor: `${element._id}`,
//         nombre: `${element.nombre}`,
//     }));
//     return nombreCodigo.value;
// });


// async function listar() {
//     try {
//    const res = await useSedes.listarSede()
//     console.log(res.data);
//     sedesTodo.value=res.data.sede

//     } catch (error) {
//         console.error("Error al listar sedes:", error);
//     }
// }

async function listaractivados() {
  try {
    const res = await useUsuarios.listaractivados();
    console.log(res.data,"resactivsdas");
    rows.value = res.data.activados.map(usuario => {
      return {
        ...usuario,
        sede: usuario.id, 
      };
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
  }
}

async function listardesactivados() {
  try {
    const res = await useUsuarios.listardesactivados();
    console.log(res,"descativados")
    rows.value = res.data.desactivados.map(usuario => {
      return {
        ...usuario,
        sede: usuario.id, 
      };
    });
  } catch (error) {
    console.error("Error al listar usuarios:", error);
  }
}

    const ordenar= ref("Todos")
   function ejecutarFiltro() {

      if (ordenar.value == 'Todos') {
        listarUsuarios();
      } else if (ordenar.value == 'Activos') {
        listaractivados();
      } else if (ordenar.value == 'Inactivos') {
        listardesactivados();
      }
    };


    
</script>


<template>
<div> 
<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
        </div>
<div class="tablaselect">

  <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
    <option value="Todos">Todos</option>
    <option value="Activos">Activos</option>
    <option value="Inactivos">Inactivos</option>
  </select>  
    
      <q-table class="table" flat bordered title="Usuarios" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-idSede="props">
        <q-td :props="props">
          <p>{{ getSedeNombre(props.row.idSede) }}</p>
        </q-td>
      </template>
          <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn class="option-button" @click="editar(props.row)">
              ✏️
                          <q-tooltip v-model="showing">Edita</q-tooltip>

            </q-btn>
            <q-btn @click="editarestado(props.row)" v-if="props.row.estado == 1" class="option-button">
              ❌
                          <q-tooltip v-model="showing">Desactiva</q-tooltip>

            </q-btn>
            <q-btn @click="editarestado(props.row)" v-else class="option-button">
              ✅
                          <q-tooltip v-model="showing">Activa</q-tooltip>

            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-btn v-if="props.row.estado == 1"
             style="color:green">Activo</q-btn>
            <q-btn v-else 
               style="color:red">Inactivo</q-btn>
          </q-td>
        </template>
    </q-table>
    </div>
      

        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
<!-- <q-select standout v-model="listar" :options="opcioneslistar" option-value="valor" option-label="label" label="Sede"    style="background-color: #grey; margin-bottom: 20px" -->
      <!-- /> -->
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Usuario" : "Editar Usuario" }}
            </div>
          </q-card-section>
                 <q-select standout v-model="idSede" :options="organizarSedes" option-value="valor" option-label="label" label="Sede"    style="background-color: #grey; margin-bottom: 20px"
      />
<q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
<q-input outlined v-model="email" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo" type="text" />
<q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Teléfono" type="text" />
<q-input v-if="accion === 1" outlined v-model="password" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Contraseña" type="text" />
 <q-select standout v-model="rol" :options="options" label="Rol" style="background-color: #grey; margin-bottom: 20px"
      />


          <q-card-actions align="right">
            <q-btn
             @click="guardar()"
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useUsuarios.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
            @click="editarusuario()"
              v-if="accion !== 1"
              color="red"
              class="text-white"
              :loading="useUsuarios.loading"
            >
              Editar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>


    </div>
    </div>
</template>

<style scoped>

.custom-select {
 position:absolute;
  width: 10vmax;
  height: 4vmin;
  background-color: rgb(170, 170, 170);
  border-radius: 1vmin;
  right: 1%;
  margin-top:1.5vmin;
  z-index: 1;
}

</style>