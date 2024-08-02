<script setup>
import { ref, onMounted } from "vue";
import { useStorePlanes } from "../store/planes.js";
import { useQuasar } from 'quasar'

const usePlan = useStorePlanes();

let agregar=ref(false)
const $q = useQuasar();

let botoneditar=ref(false)

function agregarPlan(){
  botoneditar.value=true
    agregar.value = true;

descripcion.value=""
dias.value=""
valor.value=""
}


// async function guardar(){

// agregar.value = false;
// if (await validar()){
//   const todo={
//     descripcion:descripcion.value,
//     dias:dias.value,
//     valor:valor.value
//     }
// let nombrez= await usePlan.postPlan(todo)
// if(nombrez.status!=200){
//   mostrarMensajeError("no se pudo enviar")
// }else{
//   mostrarMensajeExito("muy bien")
//   listarPlanes();
// }
// }
// }
function guardarUltimoPlan(id) {
  localStorage.setItem('ultimoPlan', id);
}

function obtenerUltimoPlan() {
  return localStorage.getItem('ultimoPlan');
}
async function guardar() {
  // agregar.value = false;

  if (await validar()) {
    const todo = {
      descripcion: descripcion.value,
      dias: dias.value,
      valor: valor.value,
    };

    try {
      let response = await usePlan.postPlan(todo);
      console.log('Respuesta del servidor:', response);

      if (response.status === 200) {
        const nuevoPlan = {
          _id: response.data.plan._id, // Asumiendo que el backend devuelve un _id
          descripcion: response.data.plan.descripcion,
          dias: response.data.plan.dias,
          valor: response.data.plan.valor,
          // ... otros campos que puedas necesitar
        };

        console.log('Nuevo plan agregado:', nuevoPlan);

        // Guardar el ID del nuevo plan en localStorage
        guardarUltimoPlan(nuevoPlan._id);

        // Añadir el nuevo registro al principio del array
        rows.value.unshift(nuevoPlan);

        console.log('Planes actualizados:', rows.value);

        mostrarMensajeExito("Plan agregado exitosamente");
        listarPlanes(); // Actualizar la lista de planes
  agregar.value = false;

      } else {
        console.error('Respuesta inesperada del servidor:', response);
        mostrarMensajeError("No se pudo agregar el plan");
      }
    } catch (error) {
      console.error("Error al guardar el plan:", error);
      mostrarMensajeError("Ocurrió un error al guardar el plan");
    }
  }
}

function editar(info) {
  agregar.value = true;
  botoneditar.value = false;

  informacion.value = info;
  descripcion.value = info.descripcion;
  dias.value = info.dias;
  valor.value = info.valor;
}


async function editarpago() {
  if (await validar()) {
    const todo = {
      descripcion: descripcion.value,
      dias: dias.value,
      valor: valor.value
    };

    if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await usePlan.putPlan(informacion.value._id, todo);
      if (response.status !== 200) {
        mostrarMensajeError("No se pudo enviar");
  agregar.value = false;

      } else {
        mostrarMensajeExito(" Plan actualizado exitosamente");
        listarPlanes();
        agregar.value = false;
      }
    } catch (error) {
      console.error("Error al actualizar el plan:", error);
      mostrarMensajeError("No se pudo enviar");
    }
  }
}


async function editarestado(info){
if(info.estado == 1){
let desactivado= await usePlan.putDesactivarPlan(info._id)
}else if(info.estado == 0){
let activado= await usePlan.putActivarPlan(info._id)
}
  listarPlanes();
}


function cerrar(){
    agregar.value = false;
}

onMounted(()=>{
  listarPlanes();
})

let informacion=ref("")
// let codigo = ref("");
let descripcion = ref("");
let dias = ref("");
let valor = ref("");

let rows=ref([])
let columns =ref([
{name:"codigo", sortable:true, label:"Código", field:"codigo", align:"center",},
    {name:"descripcion", label:"descripcion", field:"descripcion", align:"center"},
    {name:"valor", label:"Valor", field:"valor", align:"center"},
    {name:"dias", label:"Dias del plan", field:"dias", align:"center"},
    // {name:"total", label:"Total", field:"total", align:"center"},
    {name:"estado", label:"Estado del plan", field:"estado", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function validar() {
    let verificado = true;

    // if (codigo.value === "") {
    //     mostrarMensajeError("El codigo está vacío");
    //     verificado = false;
    // }
if (valor.value === "") {
    mostrarMensajeError("El valor está vacío");
    verificado = false;
} else if (!/^\d+$/.test(valor.value)) {
    mostrarMensajeError("El valor debe ser un número");
    verificado = false;
}
    if (descripcion.value === "") {
        mostrarMensajeError("La descripcion está vacía");
        verificado = false;
    }
if (dias.value === "") {
    mostrarMensajeError("Escriba cuantos dias va a durar ese plan");
    verificado = false;
} else if (!/^\d+$/.test(dias.value)) {
    mostrarMensajeError("Los días deben ser un número");
    verificado = false;
}
    // if (total.value === "") {
    //     mostrarMensajeError("El total está vacío");
    //     verificado = false;
    // }
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


// async function listarPlanes(){
//     const res = await usePlan.listarPlan()
//     console.log(res.data);
//     rows.value=res.data.plan
// }

async function listarPlanes() {
  try {
    const res = await usePlan.listarPlan();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.plan) {
      const ultimoPlanId = obtenerUltimoPlan();

      // Ordenar los planes por el plan más reciente primero
      rows.value = res.data.plan.sort((a, b) => {
        if (a._id === ultimoPlanId) return -1;
        if (b._id === ultimoPlanId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra el último plan
      });

      console.log("Planes ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar planes:", error);
  }
}

async function listaractivados() {
  try {
    const res = await usePlan.listaractivados();
    console.log(res.data,"resactivsdas");
    rows.value=res.data.activados
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

async function listardesactivados() {
  try {
    const res = await usePlan.listardesactivados();
    rows.value=res.data.desactivados
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

let listN= ref(false);
let busqueda= ref("");
    const ordenar= ref("Todos")
   function ejecutarFiltro() {

      if (ordenar.value == 'Todos') {
        listarPlanes();
        busqueda.value=""
        listN.value=false
      } else if (ordenar.value == 'Activos') {
        listaractivados();
        busqueda.value=""
        listN.value=false

      } else if (ordenar.value == 'Inactivos') {
        listardesactivados();
        busqueda.value=""
        listN.value=false

      }else if (ordenar.value == 'Nombre') {
      listN.value=true
      }};

function formatCurrency(value) {
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

      function formatCurrencyInput(value) {
  value = value.replace(/\D/g, ''); // Remove all non-digit characters
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots
}

function ejecutarlistnombre(){
ListarPorNombre()
}

async function ListarPorNombre() {
  try {
    const res = await usePlan.listarPlan(busqueda.value);
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.plan) {
      const ultimoPlanId = obtenerUltimoPlan();

      // Ordenar los planes por el plan más reciente primero
      rows.value = res.data.plan.sort((a, b) => {
        if (a._id === ultimoPlanId) return -1;
        if (b._id === ultimoPlanId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra el último plan
      });

      console.log("Planes ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar planes:", error);
  }
}

</script>

<template>
    <div class="container">
      <button class="button" @click="agregarPlan()">Agregar Plan</button>

      <div class="tablaselect">

        <div class="inputlistarn" v-if="listN">
          <input class="inputn" type="text" placeholder="Digite nombre o codigo" v-model.trim="busqueda" />
          <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
        </div>

      <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
        <option value="Todos">Todos</option>
        <option value="Activos">Activos</option>
        <option value="Inactivos">Inactivos</option>
        <option value="Nombre">Descripcion / Codigo</option>
      </select>

      <q-table class="table" flat bordered title="Planes" :rows="rows" :columns="columns" row-key="id">
         <template v-slot:body-cell-valor="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ formatCurrency(props.row.valor) }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
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
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
            <q-btn v-if="props.row.estado == 1"
             style="color:green" disable>Activo</q-btn>
            <q-btn v-else
               style="color:red" disable>Inactivo</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>


  <div  class="filtro" v-if="agregar">
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Plan</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
      <q-input class="input" filled v-model.trim="descripcion" label="Descripción" :dense="dense" />
      <q-input class="input" filled v-model.trim="valor" label="Valor" :dense="dense" />
      <q-input class="input" filled v-model.dias="dias" label="Dias" :dense="dense" />
    </div>

    <button v-if="botoneditar ==true" class="button" @click="guardar()" :loading="usePlan.loading" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarpago()" :loading="usePlan.loading" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>


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

.custom-select {
 position:absolute;
  width: 10vmax;
  height: 4vmin;
  background-color: rgb(170, 170, 170);
  border-radius: 1vmin;
  right: 1%;
  top:3%;
  z-index: 1;
}
.tablaselect{
  display: flex;
  position: relative;
  width: 90vmax;
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
