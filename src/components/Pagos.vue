<script setup>
import { ref, onMounted, computed } from "vue";
import { useStorePagos } from "../store/pagos.js";
import { useStoreClientes } from "../store/clientes.js";
import { useStorePlanes } from "../store/planes.js";

import { useQuasar } from 'quasar'
const $q = useQuasar();

const usePlan = useStorePlanes();
const usePagos = useStorePagos();
const useCliente = useStoreClientes();


let agregar=ref(false)
let botoneditar=ref(false)

function agregarpago(){
  botoneditar.value=true
    agregar.value = true;

  idPlan.value = "";
  idCliente.value = "";
}


// async function guardar(){

// agregar.value = false;
// if (await validar()){
//   const todo={
//       idPlan: idPlan.value.valor,
//       idCliente: idCliente.value.valor,
//     }
// let nombrez= await usePagos.postPago(todo)
// if(nombrez.status!=200){
//   mostrarMensajeError("no se pudo enviar")
// }else{
//   mostrarMensajeExito("Pago agregado exitosamente")
//       listarPlanes(),
//   listarPagos(), listarClientes()
// }
// }
// }

function guardarUltimoPago(id) {
  localStorage.setItem('ultimoPago', id);
}

function obtenerUltimoPago() {
  return localStorage.getItem('ultimoPago');
}

async function guardar() {
  // agregar.value = false;

  if (await validar()) {
    const todo = {
      idPlan: idPlan.value.valor,
      idCliente: idCliente.value.valor,
    };

    try {
      let response = await usePagos.postPago(todo);
      console.log('Respuesta del servidor:', response);

      if (response.status === 200) {
        const nuevoPago = {
          _id: response.data.pago._id, // Asumiendo que el backend devuelve un _id
          idPlan: response.data.pago.idPlan,
          idCliente: response.data.pago.idCliente,
          // ... otros campos que puedas necesitar
        };

        console.log('Nuevo pago agregado:', nuevoPago);

        // Guardar el ID del nuevo pago en localStorage
        guardarUltimoPago(nuevoPago._id);

        // Añadir el nuevo registro al principio del array
        rows.value.unshift(nuevoPago);

        console.log('Pagos actualizados:', rows.value);

        mostrarMensajeExito("Pago agregado exitosamente");
        listarPlanes(); // Actualizar la lista de planes
        listarPagos(); // Actualizar la lista de pagos
        listarClientes(); // Actualizar la lista de clientes
  agregar.value = false;

      } else {
        console.error('Respuesta inesperada del servidor:', response);
        mostrarMensajeError("No se pudo agregar el pago");
      }
    } catch (error) {
      console.error("Error al guardar el pago:", error);
      mostrarMensajeError("Ocurrió un error al guardar el pago");
    }
  }
}


function editar(info) {
  agregar.value = true;
  botoneditar.value = false;

  informacion.value = info;
  idPlan.value.valor = info.idPlan; 
  idCliente.value.valor = info.idCliente; 
}


async function editarpago() {
  if (await validar()) {
    const todo = {
      idPlan: idPlan.value.valor,
      idCliente: idCliente.value.valor,
    };

    if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await usePagos.putPago(informacion.value._id, todo);
      if (response.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
  agregar.value = false;

      } else {
        mostrarMensajeExito("Muy bien");
        listarPlanes();
        listarPagos();
        listarClientes();
      }
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      mostrarMensajeError("No se pudo enviar");
    }
  }
}



async function editarestado(info){
if(info.estado == 1){
let desactivado= await usePagos.putPagosDesactivar(info._id)
}else if(info.estado == 0){
let activado= await usePagos.putPagosActivar(info._id)
}
listarPagos()
}

function cerrar(){
    agregar.value = false;
}
let informacion=ref("")
let idPlan = ref("");
let idCliente = ref("");
// let valor = ref("");
let planesTodo = ref([]);
let nombreCodigoP = ref([])
let clientesTodo = ref([]);
let nombreCodigo = ref([]);
let rows = ref([]);
let columns = ref([
  {name:"idPlan", label:"Plan", field:"idPlan", align:"center"},
      { name: "idCliente", sortable: true, label: "Cliente", field: "idCliente", align: "center" },
      { name: "fecha", label: "Fecha del pago", field: "fecha", align: "center" },
      { name: "valor", label: "Valor", field: "valor", align: "center" },
      { name: "estado", label: "Estado del pago", field: "estado", align: "center" },
      { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
    ]);

async function validar() {
    let verificado = true;

        if (idCliente.value === "") {
        mostrarMensajeError("Seleccione un cliente");
        verificado = false;
    }
      if (idPlan.value === "") {
    mostrarMensajeError("El plan está vacío");
    verificado = false;
  } 
  //  if (valor.value === "") {
  //       mostrarMensajeError("El valor está vacío");
  //       verificado = false;
  //   }

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


// async function listarPagos() {
//     try {
//     const res = await usePagos.listarPago()
//  console.log("Pagos:", res.data);
//     rows.value = res.data.pago;
//   } catch (error) {
//     console.error("Error al listar Pagos:", error);
//   }
// }
async function listarPagos() {
  try {
    const res = await usePagos.listarPago();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.pago) {
      const ultimoPagoId = obtenerUltimoPago();

      // Ordenar los pagos por el pago más reciente primero
      rows.value = res.data.pago.sort((a, b) => {
        if (a._id === ultimoPagoId) return -1;
        if (b._id === ultimoPagoId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra el último pago
      });

      console.log("Pagos ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar pagos:", error);
  }
}

    onMounted(async () => {
      await listarClientes();
      await listarPagos();
      await listarPlanes();

    });

const organizarClientes = computed(() => {
  nombreCodigo.value = clientesTodo.value.map((element) => ({
    label: `${element.documento} - ${element.nombre}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
  return nombreCodigo.value;
});

async function listarClientes() {
  try {
    const res = await useCliente.listarCliente();
    clientesTodo.value = res.data.cliente;
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}

function getClienteDocumento(id) {
  const cliente = clientesTodo.value.find(cliente => cliente._id === id);
  return cliente ? `${cliente.documento} - ${cliente.nombre}` : 'Cliente no encontrado';
}

function getPlanCodigo(id) {
  const plan = planesTodo.value.find(plan => plan._id === id);
  return plan ? `${plan.codigo} - ${plan.descripcion}` : 'plan no encontrado';
}

const organizarPlanes = computed(() => {
    nombreCodigoP.value = planesTodo.value.map((element) => ({
        label: `${element.codigo} - ${element.descripcion}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigoP.value;
});


async function listarPlanes() {
    try {
    const res = await usePlan.listarPlan()
       planesTodo.value = res.data.plan;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}


    function formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    }
function formatCurrency(value) {
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
</script>

<template>
    <div class="container">
      <button class="button" @click="agregarpago()">Agregar Pago</button>
  
      <q-table class="table" flat bordered title="Pagos" :rows="rows" :columns="columns" row-key="id">
              <template v-slot:body-cell-idPlan="props">
        <q-td :props="props">
          <p>{{ getPlanCodigo(props.row.idPlan) }}</p>
        </q-td>
      </template>
    <template v-slot:body-cell-idCliente="props">
      <q-td :props="props">
          <p>{{ getClienteDocumento(props.row.idCliente) }}</p>
      </q-td>
    </template>
        <template v-slot:body-cell-fecha="props">
      <q-td :props="props">
        <p>{{ formatDate(props.row.fecha) }}</p>
      </q-td>
    </template>
          <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <p>{{ formatCurrency(props.row.valor) }}</p>
        </q-td>
      </template>
           <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn class="option-button" @click="editar(props.row)">
              ✏️
            </q-btn>
            <q-btn @click="editarestado(props.row)" v-if="props.row.estado == 1" class="option-button">
              ❌
            </q-btn>
            <q-btn @click="editarestado(props.row)" v-else class="option-button">
              ✅
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
    
  <div  class="filtro" v-if="agregar"> 
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Pago</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
               <!-- <q-select standout v-model="id" :options="organizarClientes" option-value="valor" option-label="label" label="Cliente"         style="background-color: #grey; margin-bottom: 20px"
      /> -->
                     <q-select standout v-model="idCliente" :options="organizarClientes" option-value="valor" option-label="label" label="Cliente"         style="background-color: #grey; margin-bottom: 20px"
      />
        <!-- <input class="input" type="text" placeholder="Plan" v-model.trim="plan" /> -->
                <q-select standout v-model="idPlan" :options="organizarPlanes" option-value="valor" option-label="label" label="Plan" style="background-color: #grey; margin-bottom: 20px" />

        <!-- <input class="input" type="date" placeholder="Fecha de pago" v-model.trim="fechaPago" /> -->
       <!-- <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />-->
    </div>
    
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarpago()" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>

      </div>
</div>

    </div>
  </template>
  


<style scoped>

/* Estilos para el contenedor principal */
.container {
  width: 90vmax;
  margin: 0 auto;
}

/* Estilos para el título */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
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
.buttonX {
  background-color: #ffffff00; 
  border: 0 solid #cccccc00; 
  color: #504d4d; 
  font-weight: bold; 
  font-size: 20px; 
  cursor: pointer; 
  transition: transform .2s;
}

.buttonX:hover {
    font-size: 25px; 
  transform: scale(1.2);
  color: #000000; 
}


/* Estilos para los inputs */
.input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Estilos para la tabla */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table th {
  background-color: #f2f2f2;
}

/* Estilos para las opciones de la tabla */
.option-button {
  background-color: #008CBA; /* Color azul */
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 2px;
  border-radius: 4px;
}

.option-button:hover {
  background-color: #005f6b; 
}


.crearcliente {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
width: 50vmax;
margin-left: auto;
  margin-right: auto;
      position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.encabezadoCrear{
    display: flex;
    justify-content: space-between;
}

.crearcliente h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.crearcliente input[type="text"],
.crearcliente input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.crearcliente input[type="text"]:focus,
.crearcliente input[type="date"]:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 5px #66afe9;
}

.crearcliente input[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.crearcliente input[type="submit"]:hover {
  background-color: #45a049;
}

.filtro{
background-color: #0303039f;
width: 100%;
height:  100%;
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
}

</style>
