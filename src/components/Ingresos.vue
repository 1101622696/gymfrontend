<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from 'quasar'
import { useStoreIngresos } from "../store/ingresos.js";

const useIngreso = useStoreIngresos();
let alert = ref(false)
let accion = ref(1)
let rows=ref([])
const $q = useQuasar();


function abrir(){
  accion.value=1
    alert.value = true;

idSede.value=""
idCliente.value=""
}



function guardarIngresoReciente(id) {
  localStorage.setItem('ingresoReciente', id);
}

function obtenerIngresoReciente() {
  return localStorage.getItem('ingresoReciente');
}

async function guardar() {

  if (await validar()) {
    const todo = {
      idSede: idSede.value.valor,
      idCliente: idCliente.value.valor,
    };

    console.log(`${idCliente.value.valor} es el id de cliente`);
    console.log(`${idSede.value.valor} es el id de sede`);

    try {
      let response = await useIngreso.postIngresos(todo);
      console.log('Respuesta del servidor:', response);

      if (response.status === 200 && response.data && response.data.ingreso) {
        const nuevoIngreso = {
          _id: response.data.ingreso._id,
          idSede: response.data.ingreso.idSede,
          idCliente: response.data.ingreso.idCliente,
          fecha: response.data.ingreso.fecha,
        };

        console.log('Nuevo ingreso a añadir:', nuevoIngreso);

        guardarIngresoReciente(nuevoIngreso._id);

        rows.value.unshift(nuevoIngreso);

        console.log('Filas actualizadas:', rows.value);

        mostrarMensajeExito("Ingreso agregado correctamente");
        cerrar();

        await listarClientes();
        await listarSedes();
  alert.value = false;

      } else {
        console.error('Respuesta inesperada del servidor:', response);
        mostrarMensajeError("No se pudo enviar");
      }
    } catch (error) {
      console.error("Error al guardar el ingreso:", error);
      mostrarMensajeError("Ocurrió un error al guardar el ingreso");
    }
  }
}


    function editar(info) {
          alert.value = true;
    accion.value =2;
      informacion.value = info;
          const selectedSede = sedesTodo.value.find(sede => sede._id === info.idSede);
    if (selectedSede) {
        idSede.value = {
            label: `${selectedSede.nombre}`,
            valor: selectedSede._id,
            nombre: selectedSede.nombre
        };
    }
    const selectedCliente = clientesTodo.value.find(cliente => cliente._id === info.idCliente);
    if (selectedCliente) {
        idCliente.value = {
            label: `${selectedCliente.nombre} - ${selectedCliente.documento}`,
            valor: selectedCliente._id,
            nombre: selectedCliente.nombre
        };
    }
}

    async function editaringreso() {
      if (await validar()) {
        const todo = {
          idSede: idSede.value.valor,
          idCliente: idCliente.value.valor,
        };
         try {
      const response= await useIngreso.putIngresos(informacion.value._id, todo);
        if (response.status !== 200) {
          mostrarMensajeError("No se pudo enviar");
        } else {
          mostrarMensajeExito("Ingreso actualizado exitosamente");
          listarIngresos();
  alert.value = false;

        }
      }catch (error) {
      console.error("Error al actualizar el usuario:", error);
      mostrarMensajeError("No se pudo enviar");
    }
    }
    }
let informacion=ref("")

let idSede = ref("");
let idCliente = ref("");
let fecha = ref("");
let sedesTodo = ref([]);
let clientesTodo = ref([]);
let nombreCodigoS = ref([]);
let nombreCodigoC = ref([]);
let busqueda=ref("")

let columns =ref([
      {name:"idSede", label:"Sede", field:"idSede", align:"center"},
    {name:"idCliente", sortable:true, label:" Cliente", field:"idCliente", align:"center",},
    {name:"fecha", label:"Fecha del ingreso", field:"fecha", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])



async function validar() {
    let verificado = true;

    if (idSede.value === "") {
        mostrarMensajeError("seleccione una sede");
        verificado = false;
    }
    if (idCliente.value === "") {
        mostrarMensajeError("seleccione un cliente");
        verificado = false;
    }

    if (verificado) {
        // mostrarMensajeExito("El formulario se envió correctamente");
    }

    console.log(idCliente.value);
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


      onMounted(()=>{
  listarIngresos(), listarClientes(), listarSedes();
})



import { useStoreSedes } from "../store/sedes.js";
const useSedes = useStoreSedes();


import { useStoreClientes } from "../store/clientes.js";
const useCliente = useStoreClientes();


async function listarIngresos() {
  try {
    const res = await useIngreso.listarIngreso();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.ingreso) {
      const ingresoRecienteId = obtenerIngresoReciente();

      // Ordenar los ingresos
      rows.value = res.data.ingreso.sort((a, b) => {
        if (a._id === ingresoRecienteId) return -1;
        if (b._id === ingresoRecienteId) return 1;
        return new Date(b.fecha) - new Date(a.fecha);
      });

      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar ingresos:", error);
  }
}

const organizarClientes = computed(() => {
    nombreCodigoC.value = clientesTodo.value.map((element) => ({
        label: `${element.nombre} - ${element.documento}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigoC.value;
});
async function listarClientes() {
    try {
    const res = await useCliente.listaractivados()
       clientesTodo.value = res.data.activados;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}

const organizarSedes = computed(() => {
    nombreCodigoS.value = sedesTodo.value.map((element) => ({
        label: `${element.nombre}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigoS.value;
});

async function listarSedes() {
    try {
    const res = await useSedes.listaractivadas()
       sedesTodo.value = res.data.activadas;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}


function getSedeNombre(id) {
  console.log('Buscando sede con id:', id);
  console.log('Sedes disponibles:', sedesTodo.value);
  const sede = sedesTodo.value.find((sede) => sede._id === id);
  return sede ? sede.nombre : "Dirección no encontrada";
}

function getClienteNombre(id) {
  console.log('Buscando cliente con id:', id);
  console.log('Clientes disponibles:', clientesTodo.value);
  const cliente = clientesTodo.value.find((cliente) => cliente._id === id);
  return cliente ? `${cliente.documento} - ${cliente.nombre}` : "Documento no encontrado";
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Fecha no disponible';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return date.toLocaleDateString(undefined, options);
};


const fechaBuscada=ref("")

const ordenar= ref("Todos")
    let listNombre = ref("")
    let listF= ref(false);
    let listN= ref(false);

function ejecutarFiltro() {

if (ordenar.value == 'Todos') {
  listarIngresos();
  listF.value=false
  listN.value=false
  fechaBuscada.value=""
  busqueda.value=""
}
else if (ordenar.value == 'Fecha') {
  listF.value=true
  listN.value=false
}
else if (ordenar.value == 'Nombre') {
  listN.value=true
  listF.value=false
}};

function ejecutarlistnombre(){
buscarIngresosPorNombre()
}

async function buscarIngresosPorNombre(){
  try {
    const res = await useIngreso.listarIngresoNombre(busqueda.value);
    rows.value = res.data.ingresos

  } catch (error) {
    console.error("Error al listar ingresos:", error);
  }
}


function ejecutarfecha() {

    if (fechaBuscada.value=== "") {
      mostrarMensajeError("debe ingresar un fecha");
    } else {

  buscarIngresosporfecha();
}}


async function buscarIngresosporfecha() {
  try {
    const res = await useIngreso.listarIngresosFecha(fechaBuscada.value);

    rows.value = res.data.ingresos

    console.log(res,"este ees el res de ingreoso por fecha aaaaaaaaaaaaaaaaaaaaaaaaaaa")
  } catch (error) {
    console.error("Error al buscar ingreos por fecha:", error);
    mostrarMensajeError("Ocurrió un error al buscar ingresos. Por favor, intente de nuevo.");
  }
}


</script>

<template>
  <div class="container">
        <!-- <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn  class="button" @click="abrir()">Registrar Ingreso</q-btn>
    </div> -->

    <div class="tablaselect">

      <div>
        <button class="button" @click="abrir()">Registrar Ingreso</button>
      </div>

      <div class="inputlistarn" v-if="listN">
      <input class="inputn" type="text" placeholder="Digite nombre o documento" v-model.trim="busqueda" />
      <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
    </div>


<div class="inputlistarcumple" v-if="listF">
  <input class="inputc" type="date" v-model="fechaBuscada" required />
  <button class="button" id="buttonf" @click="ejecutarfecha()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
</div>


      <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
        <option value="Todos">Todos</option>
        <option value="Fecha">Por Fecha</option>
        <option value="Nombre">Nombre/DNI</option>
      </select>
    </div>

    <div class="tituloTabla">
      Ingresos
    </div>


    <q-table class="table" flat bordered  :rows="rows" :columns="columns" row-key="_id">

      <template v-slot:body-cell-idSede="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ props.row.idSede ? getSedeNombre(props.row.idSede) : 'Sede no especificada' }}</p>
  </q-td>
</template>
<template v-slot:body-cell-idCliente="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ props.row.idCliente ? getClienteNombre(props.row.idCliente) : 'Cliente no especificado' }}</p>
  </q-td>
</template>
<template v-slot:body-cell-fecha="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ props.row.fecha ? formatDate(props.row.fecha) : 'Fecha no disponible' }}</p>
  </q-td>
</template>
        <template v-slot:body-cell-opciones="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
            <q-btn class="option-button" @click="editar(props.row)">
              ✏️
                          <q-tooltip v-model="showing">Edita</q-tooltip>
            </q-btn>
          </q-td>
        </template>
    </q-table>


    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #ffffff; margin-bottom: 20px">
            <div class="text-h6 text-black">
              {{ accion == 1 ? "Agregar Ingreso" : "Editar Ingreso" }}
            </div>
          </q-card-section>
          <!-- esta no se descomenta
          <q-input outlined v-model="fecha" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="fecha del ingreso" type="date" /> -->

          <q-select standout v-model="idSede" :options="organizarSedes" option-value="valor" option-label="label" label="Sede" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idCliente" :options="organizarClientes" option-value="valor" option-label="label" label="Cliente" style="background-color: #grey; margin-bottom: 20px" />

          <q-card-actions align="right">
            <q-btn @click="guardar()" v-if="accion === 1" color="red" class="text-white" :loading="useIngreso.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn @click="editaringreso()" v-if="accion !== 1" color="red" class="text-white" :loading="useIngreso.loading">Editar
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
</template>


<style scoped>



/* ------sigientes 4------------------------------- */

.container {
  width: 97vmax;
  margin: 0 auto;
  min-height:auto;

overflow:hidden !important;
}

.tablaselect{
  display: flex;
  position: absolute;
  width: 95%;
  margin-top: 6vmax;
}

.tituloTabla{
  margin-top: 1vmax;
    font-size: xx-large;
    display: flex;
    text-align: center;
    justify-content: center;
  
  }

.table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #f8141400;
  margin-top: 7vmax;
}



/* -------cutommm------------------------------- */
.custom-select2 {
  position:absolute;
   width: 10vmax;
   height: 4vmin;
   border-radius: 4vmin;
   right: 15%;
   margin-top:0.8vmin;
   z-index: 1;
   box-shadow: 0px 2px 5px black; 
   border: none;
   outline: none;
 }

.inputlistarcumple{
  position:absolute;
  width: auto;
  height: 4.5vmin;
  background-color: rgba(16, 16, 16, 0);
  right: 15%;
  margin-top:0.8vmin;
  z-index: 1;
  display: flex;
  flex-direction: row;

gap:1vmin;
border-radius: 1vmin;
align-items: center;
}
/*---los input-------- */
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

.inputc{
  width: 10vmax;
  margin: 8px 0;
  height: 2.5vmin;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 1vmin;
  border: solid 1.5px black;
}


.contenedorFiltro{
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
/*---custn-------- */
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

/*---button-------- */
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
  background-color: #77c57b;
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