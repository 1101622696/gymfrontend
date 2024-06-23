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

descripcion.value=""
valor.value=""
cantidad.value=""

}


// async function guardar(){

// agregar.value = false;
// if (await validar()){
//   const todo={
//     // codigo:codigo.value,
//     descripcion:descripcion.value,
//     valor:valor.value,
//     cantidad:cantidad.value

//     }
// let nombrez= await useInventario.postInventario(todo)
// if(nombrez.status!=200){
//   mostrarMensajeError("no se pudo enviar")
// }else{
//   mostrarMensajeExito("Producto agregado")
//   listarInventario()
// }
// }
// }

function guardarProductoReciente(id) {
  localStorage.setItem('productoReciente', id);
}

function obtenerProductoReciente() {
  return localStorage.getItem('productoReciente');
}

// Función guardar modificada
async function guardar() {
  agregar.value = false;
  if (await validar()) {
    const todo = {
      descripcion: descripcion.value,
      valor: valor.value,
      cantidad: cantidad.value
    };

    try {
      let response = await useInventario.postInventario(todo);
      console.log('Respuesta del servidor:', response);

      if (response.status === 200 && response.data && response.data.inventario) {
        const nuevoProducto = response.data.inventario;

        console.log('Nuevo producto a añadir:', nuevoProducto);

        // Guardar el ID del nuevo producto en localStorage
        guardarProductoReciente(nuevoProducto._id);

        // Añadir el nuevo registro al principio del array
        rows.value.unshift(nuevoProducto);

        console.log('Filas actualizadas:', rows.value);

        mostrarMensajeExito("Producto agregado");
        
        // Actualizar lista de inventario
        await listarInventario();
      } else {
        console.error('Respuesta inesperada del servidor:', response);
        mostrarMensajeError("No se pudo enviar");
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      mostrarMensajeError("Ocurrió un error al guardar el producto");
    }
  }
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info

descripcion.value=info.descripcion
valor.value=info.valor
cantidad.value=info.cantidad

}

async function editarinventario(){
if (await validar()){
  const todo={
    descripcion:descripcion.value,
    valor:valor.value,
    cantidad:cantidad.value

    }
 if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await useInventario.putInventario(informacion.value._id, todo)
if(response.status!==200){
  mostrarMensajeError("no se pudo eniar")
}else{
  mostrarMensajeExito("muy bien")
  listarInventario()
}
} catch (error) {
      console.error("Error al actualizar el inventario:", error);
      mostrarMensajeError("No se pudo enviar");
    }
}
}

function cerrar() {
  agregar.value = false;
} 

let informacion=ref("")
// let codigo = ref("");
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

// async function listarInventario(){
//     const res = await useInventario.listarInventario()
//     console.log(res.data);
//     rows.value=res.data.inventario
// }

async function listarInventario() {
  try {
    const res = await useInventario.listarInventario();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.inventario) {
      const productoRecienteId = obtenerProductoReciente();
      
      // Ordenar los productos
      rows.value = res.data.inventario.sort((a, b) => {
        if (a._id === productoRecienteId) return -1;
        if (b._id === productoRecienteId) return 1;
        // Puedes cambiar este criterio de ordenación según tus necesidades
        return b.cantidad - a.cantidad; // Ordena por cantidad de forma descendente
      });

      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar inventario:", error);
  }
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

    // if (codigo.value === "") {
    //     mostrarMensajeError("El codigo está vacío");
    //     verificado = false;
    // }
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
    function formatCurrency(value) {
  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
      
      function formatCurrencyInput(value) {
  value = value.replace(/\D/g, ''); // Remove all non-digit characters
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots
}
      
</script>

<template>
    <div class="container">
      <button class="button" @click="agregarInventario()">Agregar Inventario</button>

      <div class="tablaselect">
        <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
        </select>
  
      <q-table class="table" flat bordered title="Inventario" :rows="rows" :columns="columns" row-key="id">
                 <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <p>{{ formatCurrency(props.row.valor) }}</p>
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
    
  <div  class="filtro" v-if="agregar"> 
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Inventario</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
        <input class="input" type="text" placeholder="Descripcion" v-model.trim="descripcion" />
        <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />
        <input class="input" type="text" placeholder="Cantidad" v-model.trim="cantidad" />
    </div>
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" :loading="useInventario.loading" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarinventario()" :loading="useInventario.loading" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>

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

.q-dialog {
  width: 80%;
  max-width: 600px;
}

.seguimiento-entry {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.custom-select {
 position:absolute;
  width: 10vmax;
  height: 4vmin;
  background-color: rgb(170, 170, 170);
  border-radius: 1vmin;
  right: 1%;
  margin-top:0.8vmin;
  z-index: 1;
}
.tablaselect{
  display: flex;
  position: absolute;
  width: 100%;
}

.contenedorFiltro{
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.custom-select2 {
 position:absolute;
  width: 10vmax;
  height: 4vmin;
  background-color: rgb(170, 170, 170);
  border-radius: 1vmin;
  right: 15%;
  margin-top:0.8vmin;
  z-index: 1;
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
  width: 8vmax;
  margin: 8px 0;
  height: 2.5vmin;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 1vmin;
  border: solid 1.5px black;
}

#buttonf{
  padding: 0px;
  width: 7vmin;
  height: 2.5vmin;
  display: flex;
  text-align: center;
  padding: 0px;
}


/* estilos pa observaciones */
.truncated-text {
  display: inline-block;
  max-width: 150px;
  overflow: scroll;
  scrollbar-width: none;
  text-overflow:initial;
  white-space: nowrap;
  cursor: pointer;
}
.q-tooltip {
  max-width: 300px;
  white-space: normal;
  word-break: break-word;
}
.textarea {
  width: 100%;
  height: 200px; 
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
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