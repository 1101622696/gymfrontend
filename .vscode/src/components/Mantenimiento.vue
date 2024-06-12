<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreMantenimiento } from "../store/mantenimiento.js";



const useMantenimiento = useStoreMantenimiento();

let agregar=ref(false)
let botoneditar=ref(false)

function agregarmantenimiento(){
  botoneditar.value=true
    agregar.value = true;

idMantenimiento.value=""
descripcion.value=""
responsable.value=""
fecha.value=""
valor.value=""
}


async function guardar(){

agregar.value = true;
if (await validar()){
  const todo={
    idMantenimiento:idMantenimiento.value,
    descripcion:descripcion.value,
    responsable:responsable.value,
    fecha:fecha.value,
    valor:valor.value
    }
let nombrez= await useMantenimiento.postMantenimiento(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarMaquina(), listarMantenimiento();
}
}
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info
idMantenimiento.value=informacion.value
descripcion.value=informacion.value
responsable.value=informacion.value
fecha.value=informacion.value
valor.value=informacion.value
}

async function editarmantenimiento(){
if (await validar()){
  const todo={
    idMantenimiento:idMantenimiento.value,
    descripcion:descripcion.value,
    responsable:responsable.value,
    fecha:fecha.value,
    valor:valor.value

    }
let nombrez= await useMantenimiento.putMantenimiento(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
  listarMantenimiento();
}
}
}


function cerrar(){
    agregar.value = false;
}

let informacion=ref("")
let idMantenimiento = ref("");
let descripcion = ref("");
let responsable = ref("");
let fecha = ref("");
let valor = ref("");
let maquinaTodo = ref([]);
let nombreCodigo = ref([]);

let rows=ref([])
let columns =ref([
      {name:"idMantenimiento", label:"Máquina", field:"idMantenimiento", align:"center"},
    {name:"fecha", sortable:true, label:"Fecha del mantenimiento", field:"fecha", align:"center",},
    {name:"descripcion", label:"Descripción del mantenimiento", field:"descripcion", align:"center"},
    {name:"responsable", label:"Responsable encargado", field:"responsable", align:"center"},
    {name:"valor", label:"Valor del mantenimiento", field:"valor", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])

async function validar() {
    let verificado = true;

    if (idMantenimiento.value === "") {
        mostrarMensajeError("Seleccione una máquina");
        verificado = false;
    }
    if (fecha.value === "") {
        mostrarMensajeError("Ingrese una fecha");
        verificado = false;
    }
    if (descripcion.value === "") {
        mostrarMensajeError("La descripcion está vacía");
        verificado = false;
    } 
    if (responsable.value === "") {
        mostrarMensajeError("El responsable está vacío");
        verificado = false;
    } 
    if (valor.value === "") {
        mostrarMensajeError("El valor está vacío");
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


async function listarMantenimiento(){
    const res = await useMantenimiento.listarMantenimiento()
    console.log(res.data);
    rows.value=res.data.mantenimiento
}

onMounted(()=>{
  listarMaquina(), listarMantenimiento();
})

import { useStoreMaquina } from "../store/maquinas.js";
const useMaquina = useStoreMaquina();

const organizarMaquinas = computed(() => {
    nombreCodigo.value = maquinaTodo.value.map((element) => ({
        label: `${element.codigo}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigo.value;
});


async function listarMaquina() {
    try {
    const res = await useMaquina.listarMaquina()
       maquinaTodo.value = res.data.maquina;
    } catch (error) {
        console.error("Error al listar maquinas:", error);
    }
}
      
function getMaquinaCodigo(id) {
  const mantenimiento = maquinaTodo.value.find((mantenimiento) => mantenimiento._id === id);
  return mantenimiento ? mantenimiento.codigo : "mantenimiento no encontrado";
}

   const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    };

</script>

<template>
    <div class="container">
  
      <q-table class="table" flat bordered title="mantenimiento" :rows="rows" :columns="columns" row-key="id">
        <template v-slot:body-cell-idMantenimiento="props">
    <q-td :props="props">
      <p>{{ getMaquinaCodigo(props.row.idMantenimiento) }}</p>
    </q-td>
  </template>
      <template v-slot:body-cell-fecha="props">
      <q-td :props="props">
        <p>{{ formatDate(props.row.fecha) }}</p>
      </q-td>
    </template>
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
    
      <button class="button" @click="agregarmantenimiento()">Agregar Mantenimiento</button>
  
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Mantenimiento</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
        <q-select standout v-model="idMantenimiento" :options="organizarMaquinas" option-value="valor" option-label="label" label="Máquina" style="background-color: #grey; margin-bottom: 20px"
      />
        <input class="input" type="text" placeholder="Fecha" v-model.trim="fecha" />
        <input class="input" type="text" placeholder="Descripción" v-model.trim="descripcion" />
        <input class="input" type="date" placeholder="Responsable" v-model.trim="responsable" />
        <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />
    </div>
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarmantenimiento()" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>


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
