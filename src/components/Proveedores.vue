<script setup>
import { ref, onMounted } from "vue";
import { useStoreProveedores } from "../store/proveedores.js";
import { useQuasar } from 'quasar'

const useProveedores = useStoreProveedores();
let alert = ref(false)
let accion = ref(1)
const $q = useQuasar();

function abrir(){
  accion.value=1
  alert.value = true;

nombre.value=""
direccion.value=""
telefono.value=""
nit.value=""
email.value=""
}

    const loading = ref(false);

function guardarUltimoProveedor(id) {
  localStorage.setItem('ultimoProveedor', id);
}

function obtenerUltimoProveedor() {
  return localStorage.getItem('ultimoProveedor');
}
async function guardar() {
  // alert.value = false;

  informacion.value = '';

  if (await validar()) {
    const todo = {
      nombre: nombre.value,
      direccion: direccion.value,
      telefono: telefono.value,
      nit: nit.value,
      email: email.value
    };

    try {
      loading.value = true;
      const response = await useProveedores.postProveedor(todo);

      if (response.status === 200) {
        const nuevoProveedor = {
          _id: response.data.proveedor._id,
          nombre: response.data.proveedor.nombre,
          direccion: response.data.proveedor.direccion,
          telefono: response.data.proveedor.telefono,
          nit: response.data.proveedor.nit,
          email: response.data.proveedor.email,
        };

        guardarUltimoProveedor(nuevoProveedor._id);

        rows.value.unshift(nuevoProveedor);

        mostrarMensajeExito("Proveedor agregada exitosamente");
        listarProveedores(); 
  alert.value = false;

      } else {
        mostrarMensajeError("No se pudo agregar el proveedor");
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
  nit.value = info.nit;
  email.value = info.email;
}


async function editarProveedor() {
  if (await validar()) {
    const todo = {
      nombre: nombre.value,
      direccion: direccion.value,
      telefono: telefono.value,
      nit: nit.value,
      email: email.value
    };

    if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await useProveedores.putProveedor(informacion.value._id, todo);
      if (response.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
      } else {
        mostrarMensajeExito("Proveedor actualizado exitosamente");
        listarProveedores();
  alert.value = false;

      }
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      mostrarMensajeError("No se pudo enviar");
    }
  }
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useProveedores.putDesactivarProveedor(info._id)
console.log(desactivado);

}else if(info.estado == 0){
let activado= await useProveedores.putActivarProveedor(info._id)
console.log(activado);
}
  listarProveedores();
}


let informacion=ref("")
let nombre = ref("");
let direccion = ref("");
let telefono = ref("");
let nit = ref("");
let email = ref("");

let rows=ref([])
let columns =ref([
    {name:"nombre", label:"Nombre", field:"nombre", align:"center"},
    {name:"direccion", label:"Dirección", field:"direccion", align:"center"},
    {name:"telefono", label:"Telefono", field:"telefono", align:"center"},
    {name:"nit", label:"nit", field:"nit", align:"center"},
    {name:"email", label:"Email", field:"email", align:"center"},
    {name:"estado", label:"Estado", field:"estado", align:"center"},
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
    if (nit.value === "") {
        mostrarMensajeError("Ingrese una nit");
        verificado = false;
    }
    if (direccion.value === "") {
        mostrarMensajeError("La dirección está vacía");
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


// async function listarProveedores(){
//     const res = await useProveedores.listarSede()
//     console.log(res.data);
//     rows.value=res.data.sede
// }

      async function listarProveedores() {
  try {
    const res = await useProveedores.listarProveedor();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.proveedor) {
      const ultimoProveedorId = obtenerUltimoProveedor();

      rows.value = res.data.proveedor.sort((a, b) => {
        if (a._id === ultimoProveedorId) return -1;
        if (b._id === ultimoProveedorId) return 1;
        return 0; 
      });

      console.log("Proveedores ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar Proveedores:", error);
  }
}


function cerrar() {
    alert.value = false;
}

onMounted(()=>{
  listarProveedores();
})

async function listaractivadas() {
  try {
    const res = await useProveedores.listaractivados();
    console.log(res.data,"resactivados");
    rows.value=res.data.activados
  } catch (error) {
    console.error("Error al listar proveedores:", error);
  }
}

async function listardesactivados() {
  try {
    const res = await useProveedores.listardesactivados();
    rows.value=res.data.desactivados
  } catch (error) {
    console.error("Error al listar proveedores:", error);
  }
}

let listN= ref(false);
let busqueda= ref("");
    const ordenar= ref("Todos")
   function ejecutarFiltro() {

      if (ordenar.value == 'Todos') {
        listarProveedores();
        busqueda.value=""
      listN.value=false

      } else if (ordenar.value == 'Activos') {
        listaractivadas();
        busqueda.value=""
      listN.value=false

      } else if (ordenar.value == 'Inactivos') {
        listardesactivados();
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
    const res = await useProveedores.listarProveedor(busqueda.value);
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.proveedor) {
      const ultimoProveedorId = obtenerUltimoProveedor();

      rows.value = res.data.proveedor.sort((a, b) => {
        if (a._id === ultimoProveedorId) return -1;
        if (b._id === ultimoProveedorId) return 1;
        return 0; 
      });

      console.log("Proveedores ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar Proveedores:", error);
  }
}

</script>

<template>
    <div class="container">
<!-- <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Proveedor</q-btn>
        </div> -->
      <div class="tablaselect">

        <button class="button" @click="abrir()">Registrar Proveedor</button>

        <div class="inputlistarn" v-if="listN">
          <input class="inputn" type="text" placeholder="Digite nombre o nit" v-model.trim="busqueda" />
          <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
        </div>

        <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
          <option value="Nombre">Por Nombre/nit</option>
        </select>
      </div>

      <div class="tituloTabla">
  Proveedores
 </div>

            <q-table class="table" flat bordered  :rows="rows" :columns="columns" row-key="id">
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
             style="color:green" disable>Activo</q-btn>
            <q-btn v-else
               style="color:red" disable>Inactivo</q-btn>
          </q-td>
        </template>
      </q-table>



    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #ffffff; margin-bottom: 20px"
          >
            <div class="text-h6 text-black">
              {{ accion == 1 ? "Agregar Proveedor" : "Editar Proveedor" }}
            </div>
          </q-card-section>
<q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre" type="text" />
  <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion" type="text" />
  <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Teléfono" type="text" />
  <q-input outlined v-model="nit" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="nit" type="text" />
  <q-input outlined v-model="email" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="email" type="text" />


          <q-card-actions align="right">
            <q-btn
            @click="guardar()"
              v-if="accion === 1"
              color="blue"
              class="text-white"
              :loading="useProveedores.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="secundary" size="1em" />
              </template>
            </q-btn>
            <q-btn
            @click="editarProveedor()"
              v-if="accion !== 1"
              color="blue"
              class="text-white"
              :loading="useProveedores.loading"
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
.container {
  width: 97vmax;
  margin: 0 auto;
  min-height:auto;

overflow:hidden !important;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #f8141400;
  margin-top: 7vmax;
}
.custom-select {
  position:absolute;
   width: 10vmax;
   height: 4vmin;
   border-radius: 4vmin;
   right: 1%;
   margin-top:0.8vmin;
   z-index: 1;
   box-shadow: 0px 2px 5px black; 
   border: none;
   outline: none;
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
 
 border: none;
 color: black;
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

.tituloTabla{
  margin-top: 1vmax;
    font-size: xx-large;
    display: flex;
    text-align: center;
    justify-content: center;
  
  }

  .tablaselect{
    display: flex;
    position: absolute;
    width: 95%;
    margin-top: 6vmax;
  }



</style>