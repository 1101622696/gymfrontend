<script setup>
import { ref, onMounted } from "vue";
import { useStorePlanes } from "../store/planes.js";

const usePlan = useStorePlanes();

let agregar=ref(false)

let botoneditar=ref(false)

function agregarPlan(){
  botoneditar.value=true
    agregar.value = true;

codigo.value=""
descripcion.value=""
dias.value=""
valor.value=""
}


async function guardar(){

agregar.value = true;
if (await validar()){
  const todo={
    codigo:codigo.value,
    descripcion:descripcion.value,
    dias:dias.value,
    valor:valor.value
    }
let nombrez= await usePlan.postPlan(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarPlanes();
}
}
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info
codigo.value=informacion.value
descripcion.value=informacion.value
dias.value=informacion.value
valor.value=informacion.value
}

async function editarpago(){
if (await validar()){
  const todo={
    codigo:codigo.value,
    descripcion:descripcion.value,
    dias:dias.value,
    valor:valor.value

    }
let nombrez= await usePlan.putPlan(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarPlanes();
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
let codigo = ref("");
let descripcion = ref("");
let dias = ref("");
let valor = ref("");

let rows=ref([])
let columns =ref([
{name:"codigo", sortable:true, label:"Código", field:"codigo", align:"center",},
    {name:"descripcion", label:"descripcion", field:"descripcion", align:"center"},
    {name:"valor", label:"Valor", field:"valor", align:"center"},
    {name:"dias", label:"Dias del plan", field:"dias", align:"center"},
    {name:"total", label:"Total", field:"total", align:"center"},
    {name:"estado", label:"Estado del plan", field:"estado", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function validar() {
    let verificado = true;

    if (codigo.value === "") {
        mostrarMensajeError("El codigo está vacío");
        verificado = false;
    }
    if (valor.value === "") {
        mostrarMensajeError("El valor está vacío");
        verificado = false;
    }
    if (descripcion.value === "") {
        mostrarMensajeError("La descripcion está vacía");
        verificado = false;
    } 
    if (dias.value === "") {
        mostrarMensajeError("Escriba cuantos dias va a durar ese plan");
        verificado = false;
    } 
    if (total.value === "") {
        mostrarMensajeError("El total está vacío");
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


async function listarPlanes(){
    const res = await usePlan.listarPlan()
    console.log(res.data);
    rows.value=res.data.plan
}
      
</script>

<template>
    <div class="container">
  
      <q-table class="table" flat bordered title="Planes" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn class="option-button" @click="editar(props.row)">
              ✏️
            </q-btn>
            <q-btn v-if="props.row.estado == 1" class="option-button">
              ❌
            </q-btn>
            <q-btn v-else class="option-button">
              ✅
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-btn v-if="props.row.estado == 1"
            @click="editarestado(props.row)"
             style="color:green">Activo</q-btn>
            <q-btn v-else 
               @click="editarestado(props.row)"
               style="color:red">Inactivo</q-btn>
          </q-td>
        </template>
      </q-table>

  <div>
      <button class="button" @click="agregarPlan()">Agregar Plan</button>
  
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Plan</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
        <input class="input" type="text" placeholder="Código" v-model.trim="codigo" />
        <input class="input" type="text" placeholder="Descripción" v-model.trim="Descripcion" />
        <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />
        <input class="input" type="text" placeholder="Dias" v-model.trim="dias" />
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

</style>
