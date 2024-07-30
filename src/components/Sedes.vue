<script setup>
import { ref, onMounted } from "vue";
import { useStoreSedes } from "../store/sedes.js";
import { useQuasar } from 'quasar'

const useSedes = useStoreSedes();
let alert = ref(false)
let accion = ref(1)
const $q = useQuasar();

function abrir(){
  accion.value=1
    alert.value = true;

nombre.value=""
direccion.value=""
telefono.value=""
ciudad.value=""
// codigo.value=""
horario.value=""
}

    const loading = ref(false);

//    async function  guardar () {
// alert.value = false;

//       informacion.value = '';
//       if (await validar()) {
//         const todo = {
//           nombre: nombre.value,
//           direccion: direccion.value,
//           telefono: telefono.value,
//           ciudad: ciudad.value,
//           horario: horario.value
//         };

//         console.log(nombre.value);
//         console.log(direccion.value);
//         console.log(telefono.value);
//         console.log(ciudad.value);
//         console.log(horario.value);

//         try {
//           loading.value = true;
//           const response = await useSedes.postSede(todo);
//           if (response.status === 200) {
//             mostrarMensajeExito("Sede agregada exitosamente");
//             listarSedes();
//           } else {
//             mostrarMensajeError("No se pudo agregar la Sede");
//           }
//         } catch (error) {
//           mostrarMensajeError("Error al enviar la solicitud: " + error.message);
//         }
//         finally {
//           loading.value = false;
//         }
//       }
//     };

function guardarUltimaSede(id) {
  localStorage.setItem('ultimaSede', id);
}

function obtenerUltimaSede() {
  return localStorage.getItem('ultimaSede');
}
async function guardar() {
  // alert.value = false;

  informacion.value = '';

  if (await validar()) {
    const todo = {
      nombre: nombre.value,
      direccion: direccion.value,
      telefono: telefono.value,
      ciudad: ciudad.value,
      horario: horario.value
    };

    try {
      loading.value = true;
      const response = await useSedes.postSede(todo);

      if (response.status === 200) {
        const nuevaSede = {
          _id: response.data.sede._id, // Asumiendo que el backend devuelve un _id
          nombre: response.data.sede.nombre,
          direccion: response.data.sede.direccion,
          telefono: response.data.sede.telefono,
          ciudad: response.data.sede.ciudad,
          horario: response.data.sede.horario,
          // ... otros campos que puedas necesitar
        };

        // Guardar el ID de la nueva sede en localStorage
        guardarUltimaSede(nuevaSede._id);

        // Añadir la nueva sede al principio del array
        rows.value.unshift(nuevaSede);

        mostrarMensajeExito("Sede agregada exitosamente");
        listarSedes(); // Actualizar la lista de sedes
  alert.value = false;

      } else {
        mostrarMensajeError("No se pudo agregar la Sede");
      }
    } catch (error) {
      mostrarMensajeError("Error al enviar la solicitud: " + error.message);
    } finally {
      loading.value = false;
    }
  }
}


function editar(info) {
  alert.value = true;
  accion.value = 2;

  informacion.value = info;

  nombre.value = info.nombre;
  direccion.value = info.direccion;
  telefono.value = info.telefono;
  ciudad.value = info.ciudad;
  horario.value = info.horario;
}


async function editarsede() {
  if (await validar()) {
    const todo = {
      nombre: nombre.value,
      direccion: direccion.value,
      telefono: telefono.value,
      ciudad: ciudad.value,
      horario: horario.value
    };

    if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await useSedes.putSedes(informacion.value._id, todo);
      if (response.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
      } else {
        mostrarMensajeExito("Sede actualizada exitosamente");
        listarSedes();
  alert.value = false;

      }
    } catch (error) {
      console.error("Error al actualizar la sede:", error);
      mostrarMensajeError("No se pudo enviar");
    }
  }
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useSedes.putDesactivarSede(info._id)
}else if(info.estado == 0){
let activado= await useSedes.putActivarSede(info._id)
}
  listarSedes();
}


let informacion=ref("")
let nombre = ref("");
let direccion = ref("");
let telefono = ref("");
let ciudad = ref("");
// let codigo = ref("");
let horario = ref("");

let rows=ref([])
let columns =ref([
    {name:"nombre", label:"Nombre de Sede", field:"nombre", align:"center"},
    {name:"direccion", label:"Dirección", field:"direccion", align:"center"},
    {name:"telefono", label:"Telefono de sede", field:"telefono", align:"center"},
    {name:"ciudad", label:"Ciudad", field:"ciudad", align:"center"},
    // {name:"codigo", sortable:true, label:"Código", field:"codigo", align:"center",},
    {name:"horario", label:"Horario de la Sede", field:"horario", align:"center"},
    {name:"estado", label:"Estado de Sede", field:"estado", align:"center"},
    { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function validar() {
    let verificado = true;

    if (nombre.value === "") {
        mostrarMensajeError("El nombre está vacío");
        verificado = false;
    }
    if (ciudad.value === "") {
        mostrarMensajeError("Ingrese una ciudad");
        verificado = false;
    }
    if (direccion.value === "") {
        mostrarMensajeError("La dirección está vacía");
        verificado = false;
    }
    // if (codigo.value === "") {
    //     mostrarMensajeError("Ingrese un código");
    //     verificado = false;
    // }
    if (horario.value === "") {
        mostrarMensajeError("escriba el horario de la sede");
        verificado = false;
    }
        if (telefono.value === "" || isNaN(telefono.value) || telefono.value.length < 10) {
        mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
        verificado = false;
    }

    if (verificado) {
        // mostrarMensajeExito("El formulario se envió correctamente");
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


// async function listarSedes(){
//     const res = await useSedes.listarSede()
//     console.log(res.data);
//     rows.value=res.data.sede
// }

      async function listarSedes() {
  try {
    const res = await useSedes.listarSede();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.sede) {
      const ultimaSedeId = obtenerUltimaSede();

      // Ordenar las sedes poniendo la última sede agregada primero
      rows.value = res.data.sede.sort((a, b) => {
        if (a._id === ultimaSedeId) return -1;
        if (b._id === ultimaSedeId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra la última sede
      });

      console.log("Sedes ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar sedes:", error);
  }
}


function cerrar() {
    alert.value = false;
}

onMounted(()=>{
  listarSedes();
})

async function listaractivadas() {
  try {
    const res = await useSedes.listaractivadas();
    console.log(res.data,"resactivsdas");
    rows.value=res.data.activadas
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

async function listardesactivadas() {
  try {
    const res = await useSedes.listardesactivadas();
    rows.value=res.data.desactivadas
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

let listN= ref(false);
let busqueda= ref("");
    const ordenar= ref("Todos")
   function ejecutarFiltro() {

      if (ordenar.value == 'Todos') {
        listarSedes();
        busqueda.value=""
      listN.value=false

      } else if (ordenar.value == 'Activos') {
        listaractivadas();
        busqueda.value=""
      listN.value=false

      } else if (ordenar.value == 'Inactivos') {
        listardesactivadas();
        busqueda.value=""
      listN.value=false

      }else if (ordenar.value == 'Nombre') {
      listN.value=true
      }};

      function ejecutarlistnombre(){
ListarPorNombre()
}

async function ListarPorNombre() {
  try {
    const res = await useSedes.listarSede(busqueda.value);
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.sede) {
      const ultimaSedeId = obtenerUltimaSede();

      // Ordenar las sedes poniendo la última sede agregada primero
      rows.value = res.data.sede.sort((a, b) => {
        if (a._id === ultimaSedeId) return -1;
        if (b._id === ultimaSedeId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra la última sede
      });

      console.log("Sedes ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar sedes:", error);
  }
}

</script>

<template>
    <div>
<div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Sede</q-btn>
        </div>
      <div class="tablaselect">

        <div class="inputlistarn" v-if="listN">
          <input class="inputn" type="text" placeholder="Digite nombre o ciudad" v-model.trim="busqueda" />
          <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
        </div>

        <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
          <option value="Nombre">Por Nombre/Ciudad</option>
        </select>

            <q-table class="table" flat bordered title="Sedes" :rows="rows" :columns="columns" row-key="id">
           <template v-slot:body-cell-opciones="props">
          <q-td :props="props" style="text-align: center;">
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


    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #a1312d; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Sede" : "Editar Sede" }}
            </div>
          </q-card-section>
<q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre" type="text" />
  <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion" type="text" />
  <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Teléfono" type="text" />
  <q-input outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ciudad" type="text" />
      <!-- <q-input outlined v-model="codigo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Codigo" type="text" />                      -->
  <q-input outlined v-model="horario" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Horario" type="text" />


          <q-card-actions align="right">
            <q-btn
            @click="guardar()"
              v-if="accion === 1"
              color="blue"
              class="text-white"
              :loading="useSedes.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="secundary" size="1em" />
              </template>
            </q-btn>
            <q-btn
            @click="editarsede()"
              v-if="accion !== 1"
              color="blue"
              class="text-white"
              :loading="useSedes.loading"
            >
              Editar
              <template v-slot:loading>
                <q-spinner color="secundary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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

.inputlistarn{
  position:absolute;
  width: auto;
  height: 4.5vmin;
  gap: 1vmin;
  background-color: rgba(16, 16, 16, 0);
  right: 15%;
  margin-top:0.5vmin;
  z-index: 1;
  display: flex;
  flex-direction: row;
align-items: center;
}

.inputn{
  width: 15vmax;
  margin: 8px 0;
  height: 2.5vmin;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 1vmin;
  border: solid 1.5px black;
}

.button {
  background-color: #45a049;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  margin-bottom: 10px;
  box-shadow: 5px 4px 8px black;
  border-radius: 8px;
}

.button:hover {
  background-color: #69bb6d;
  box-shadow: 3px 2px 10px black;
}

#buttonf{
  padding: 0px;
  width: 8vmin;
  height: 2.5vmin;
  display: flex;
  text-align: center;
  padding: 0px;
  font-size: small;
  margin: 0px;
  margin-bottom: 1px;
}


</style>