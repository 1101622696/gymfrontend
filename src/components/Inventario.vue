<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from 'quasar'
import { useStoreInventario } from "../store/inventario.js";

const useInventario = useStoreInventario();

let agregar=ref(false)
const $q = useQuasar();

let botoneditar=ref(false)

function agregarInventario(){
  botoneditar.value=true
    agregar.value = true;

codigo.value=""
descripcion.value=""
valor.value=""
cantidad.value=""

}


async function guardar(){

agregar.value = true;
if (await validar()){
  const todo={
    codigo:codigo.value,
    descripcion:descripcion.value,
    valor:valor.value,
    cantidad:cantidad.value

    }
let nombrez= await useInventario.postInventario(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarInventario()
}
}
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info
codigo.value=informacion.value
descripcion.value=informacion.value
valor.value=informacion.value
cantidad.value=informacion.value

}

async function editarinventario(){
if (await validar()){
  const todo={
    codigo:codigo.value,
    descripcion:descripcion.value,
    valor:valor.value,
    cantidad:cantidad.value

    }
let nombrez= await useInventario.putInventario(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo eniar")
}else{
  mostrarMensajeExito("muy bien")
  listarInventario()
}
}
}


function cerrar() {
  agregar.value = false;
} 

let informacion=ref("")
let codigo = ref("");
let descripcion = ref("");
let valor = ref("");
let cantidad = ref("");

let rows=ref([])
let columns =ref([
    {name:"codigo", sortable:true, label:"Codigo", field:"codigo", align:"center",},
    {name:"descripcion", label:"descripcion del producto", field:"descripcion", align:"center"},
    {name:"valor", label:"Valor del producto", field:"valor", align:"center"},
    {name:"cantidad", label:"cantidad disponible", field:"cantidad", align:"center"},
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function listarInventario(){
    const res = await useInventario.listarInventario()
    console.log(res.data);
    rows.value=res.data.inventario
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useInventario.putDesactivarInventario(info._id)
}else if(info.estado == 0){
let activado= await useInventario.putActivarInventario(info._id)
}
  listarInventario()
}
onMounted(()=>{
  listarInventario()
})

async function validar() {
    let verificado = true;

    if (codigo.value === "") {
        mostrarMensajeError("El codigo está vacío");
        verificado = false;
    }
    if (descripcion.value === "") {
        mostrarMensajeError("la descripcion está vacío");
        verificado = false;
    }
    if (valor.value === "") {
        mostrarMensajeError("Ingrese un valor");
        verificado = false;
}
    if (cantidad.value === "") {
        mostrarMensajeError("la cantidad está vacía");
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

async function listaractivados() {
  try {
    const res = await useInventario.listaractivados();
    console.log(res.data,"resactivsdas");
    rows.value=res.data.activados
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

async function listardesactivados() {
  try {
    const res = await useInventario.listardesactivados();
    console.log(res.data,"dessresactivsdas");
    rows.value=res.data.desactivados
  } catch (error) {
    console.error("Error al listar maquinas:", error);
  }
}

    const ordenar= ref("Todos")
   function ejecutarFiltro() {

      if (ordenar.value == 'Todos') {
        listarInventario();
      } else if (ordenar.value == 'Activos') {
        listaractivados();
      } else if (ordenar.value == 'Inactivos') {
        listardesactivados();
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
  
      <q-table class="table" flat bordered title="Inventario" :rows="rows" :columns="columns" row-key="id">
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
    
      <button class="button" @click="agregarInventario()">Agregar Inventario</button>
  
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Inventario</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
        <input class="input" type="text" placeholder="Código" v-model.trim="codigo" />
        <input class="input" type="text" placeholder="Descripcion" v-model.trim="descripcion" />
        <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />
        <input class="input" type="date" placeholder="Cantidad" v-model.trim="cantidad" />
    </div>
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarinventario()" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>

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
