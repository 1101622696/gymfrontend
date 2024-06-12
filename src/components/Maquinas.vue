<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreMaquina } from "../store/maquinas.js";
import { useQuasar } from 'quasar'

const useMaquina = useStoreMaquina();

let agregar=ref(false)
let botoneditar=ref(false)
const $q = useQuasar();

function agregarmaquina(){
  botoneditar.value=true
  agregar.value = true;

idSede.value=""
codigo.value=""
descripcion.value=""
fechaIngreso.value=""
fechaUltmantenimiento.value=""

}


async function guardar(){

agregar.value = true;
if (await validar()){
  const todo={
    idSede:idSede.value,
    codigo:codigo.value,
    descripcion:descripcion.value,
    fechaIngreso:fechaIngreso.value,
    fechaUltmantenimiento:fechaUltmantenimiento.value
    }
let nombrez= await useMaquina.postMaquina(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarMaquina(), listarSedes();
}
}
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info
idSede.value=informacion.value
codigo.value=informacion.value
descripcion.value=informacion.value
fechaIngreso.value=informacion.value
fechaUltmantenimiento.value=informacion.value
}

async function editarmaquina(){
if (await validar()){
  const todo={
    idSede:idSede.value,
    codigo:codigo.value,
    descripcion:descripcion.value,
    fechaIngreso:fechaIngreso.value,
    fechaUltmantenimiento:fechaUltmantenimiento.value


    }
let nombrez= await useMaquina.putMaquina(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarMaquina(), listarSedes();
}
}
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useMaquina.putDesactivarMaquina(info._id)
}else if(info.estado == 0){
let activado= await useMaquina.putActivarMaquina(info._id)
}
  listarMaquina()
}

function cerrar(){
    agregar.value = false;
}

let informacion=ref("")
let idSede = ref("");
let codigo = ref("");
let descripcion = ref("");
let fechaIngreso = ref("");
let fechaUltmantenimiento = ref("");
let sedesTodo = ref([]);
let nombreCodigo = ref([]);

let rows=ref([])
let columns =ref([
      {name:"idSede", label:"Sede", field:"idSede", align:"center"},
    {name:"codigo", sortable:true, label:"Código de la máquina", field:"codigo", align:"center",},
    {name:"descripcion", label:"Descripción", field:"descripcion", align:"center"},
    {name:"fechaIngreso", label:"Fecha del ingreso", field:"fechaIngreso", align:"center"},
    {name:"fechaUltmantenimiento", label:"Fecha del último mantenimiento", field:"fechaUltmantenimiento", align:"center"},
    {name:"estado", label:"Estado del pago", field:"estado", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function validar() {
    let verificado = true;

    if (idSede.value === "") {
        mostrarMensajeError("seleccione una sede");
        verificado = false;
    }
    if (codigo.value === "") {
        mostrarMensajeError("El codigo está vacío");
        verificado = false;
    }
    if (descripcion.value === "") {
        mostrarMensajeError("La descripcion está vacía");
        verificado = false;
    }
    if (fechaIngreso.value === "") {
        mostrarMensajeError("digite la fecha de ingreso");
        verificado = false;
    } 
    if (fechaUltmantenimiento.value === "") {
        mostrarMensajeError("fecha ultimo de mantenimiento");
        verificado = false;
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


async function listarMaquina(){
    const res = await useMaquina.listarMaquina()
    console.log(res.data);
    rows.value=res.data.maquina
}

onMounted(()=>{
  listarMaquina(), listarSedes();
})

import { useStoreSedes } from "../store/sedes.js";
const useSedes = useStoreSedes();
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
       sedesTodo.value = res.data.sede;
    } catch (error) {
        console.error("Error al listar sedes:", error);
    }
}

function getSedeNombre(id) {
  const sede = sedesTodo.value.find(sede => sede._id === id);
  return sede ? sede.nombre : '';
}
   const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    };
      


    async function listaractivadas() {
  try {
    const res = await useMaquina.listaractivadas();
    console.log(res.data,"resactivsdas");
    rows.value=res.data.activadas
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

async function listardesactivadas() {
  try {
    const res = await useMaquina.listardesactivadas();
    rows.value=res.data.desactivadas
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

    const ordenar= ref("Todos")
   function ejecutarFiltro() {

      if (ordenar.value == 'Todos') {
        listarMaquina();
      } else if (ordenar.value == 'Activos') {
        listaractivadas();
      } else if (ordenar.value == 'Inactivos') {
        listardesactivadas();
      }
    };




</script>

<template>
    <div class="container">

      <div class="tablaselect">
      <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
        <option value="Todos">Todos</option>
        <option value="Activos">Activos</option>
        <option value="Inactivos">Inactivos</option>
      </select>
    
  
      <q-table class="table" flat bordered title="Maquinas" :rows="rows" :columns="columns" row-key="id">
            <template v-slot:body-cell-idSede="props">
        <q-td :props="props">
          <p>{{ getSedeNombre(props.row.idSede) }}</p>
        </q-td>
      </template>
  <template v-slot:body-cell-fechaIngreso="props">
      <q-td :props="props">
        <p>{{ formatDate(props.row.fechaIngreso) }}</p>
      </q-td>
    </template>
    <template v-slot:body-cell-fechaUltmantenimiento="props">
      <q-td :props="props">
        <p>{{ formatDate(props.row.fechaUltmantenimiento) }}</p>
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
    </div>
      <!-- <button class="button" @click="listarMaquina()">Traer Datos</button> -->
  
      <button class="button" @click="agregarmaquina()">Agregar Maquina</button>
  
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Maquina</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
       <q-select standout v-model="idSede" :options="organizarSedes" option-value="valor" option-label="label" label="Sede"         style="background-color: #grey; margin-bottom: 20px"
      />
        <input class="input" type="text" placeholder="Código" v-model.trim="codigo" />
        <input class="input" type="text" placeholder="Descripción" v-model.trim="descripcion" />
        <input class="input" type="date" placeholder="fecha de ingreso" v-model.trim="fechaIngreso" />
        <input class="input" type="date" placeholder="Última fecha de mantenimiento " v-model.trim="fechaUltmantenimiento" />
    </div>
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarmaquina()" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>


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

/* Estilos para los botones */
.button {
  background-color: #070707; /* Color verde */
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
  border-radius: 8px;
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




.button:hover {
  background-color: #45a049; 
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

</style>
