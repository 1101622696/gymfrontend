<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreMantenimiento } from "../store/mantenimiento.js";
import { useQuasar } from 'quasar'



const useMantenimiento = useStoreMantenimiento();

let agregar=ref(false)
let botoneditar=ref(false)
const $q = useQuasar();

function agregarmantenimiento(){
  botoneditar.value=true
    agregar.value = true;

idMantenimiento.value=""
descripcion.value=""
responsable.value=""
// fecha.value=""
valor.value=""
}


// async function guardar(){

// agregar.value = false;
// if (await validar()){
//   const todo={
//     idMantenimiento:idMantenimiento.value.valor,
//     descripcion:descripcion.value,
//     responsable:responsable.value,
//     // fecha:fecha.value,
//     valor:valor.value
//     }
// let nombrez= await useMantenimiento.postMantenimiento(todo)
// if(nombrez.status!=200){
//   mostrarMensajeError("no se pudo enviar")
// }else{
//   mostrarMensajeExito("mantenimiento agregado")
//   listarMaquina(), listarMantenimiento();
// }
// }
// }


function guardarMantenimientoReciente(id) {
  localStorage.setItem('mantenimientoReciente', id);
}

function obtenerMantenimientoReciente() {
  return localStorage.getItem('mantenimientoReciente');
}
async function guardar() {
  // agregar.value = false;

  if (await validar()) {
    const todo = {
      idMantenimiento: idMantenimiento.value.valor,
      descripcion: descripcion.value,
      responsable: responsable.value,
      // fecha: fecha.value, // Asumiendo que la fecha no se usa actualmente
      valor: valor.value
    };

    try {
      let response = await useMantenimiento.postMantenimiento(todo);
      console.log('Respuesta del servidor:', response);

      if (response.status === 200) {
        const nuevoMantenimiento = {
          _id: response.data.mantenimiento._id, // Asumiendo que el backend devuelve un _id
          idMantenimiento: response.data.mantenimiento.idMantenimiento,
          descripcion: response.data.mantenimiento.descripcion,
          responsable: response.data.mantenimiento.responsable,
          valor: response.data.mantenimiento.valor,
          // ... otros campos que puedas necesitar
        };

        console.log('Nuevo mantenimiento añadido:', nuevoMantenimiento);

        // Guardar el ID del nuevo mantenimiento en localStorage
        guardarMantenimientoReciente(nuevoMantenimiento._id);

        // Añadir el nuevo registro al principio del array
        rows.value.unshift(nuevoMantenimiento);

        console.log('Mantenimientos actualizados:', rows.value);

        mostrarMensajeExito("Mantenimiento agregado correctamente");
        listarMaquina(); // Actualizar la lista de máquinas si es necesario
        listarMantenimiento(); // Actualizar la lista de mantenimientos
  agregar.value = false;

      } else {
        console.error('Respuesta inesperada del servidor:', response);
        mostrarMensajeError("No se pudo agregar el mantenimiento");
      }
    } catch (error) {
      console.error("Error al guardar el mantenimiento:", error);
      mostrarMensajeError("Ocurrió un error al guardar el mantenimiento");
    }
  }
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info
idMantenimiento.value.valor=info.idMantenimiento
descripcion.value=info.descripcion
responsable.value=info.responsable
// fecha.value=info.fecha
valor.value=info.valor
}

async function editarmantenimiento(){
if (await validar()){
  const todo={
    idMantenimiento:idMantenimiento.value.valor,
    descripcion:descripcion.value,
    responsable:responsable.value,
    // fecha:fecha.value,
    valor:valor.value

    }
if (!informacion.value || !informacion.value._id) {
      console.error("ID de información no definido:", informacion.value);
      mostrarMensajeError("No se pudo enviar, ID no definido");
      return;
    }

    try {
      const response = await useMantenimiento.putMantenimiento(informacion.value._id, todo)
if(response.status!==200){
  mostrarMensajeError("no se pudo enviar")
  agregar.value = false;

}else{
  mostrarMensajeExito("muy bien")
  listarMantenimiento();
}
}catch (error) {
      console.error("Error al actualizar el mantenimiento:", error);
      mostrarMensajeError("No se pudo enviar");
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
// let fecha = ref("");
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
    // if (fecha.value === "") {
    //     mostrarMensajeError("Ingrese una fecha");
    //     verificado = false;
    // }
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


// async function listarMantenimiento(){
//     const res = await useMantenimiento.listarMantenimiento()
//     console.log(res.data);
//     rows.value=res.data.mantenimiento
// }

async function listarMantenimiento() {
  try {
    const res = await useMantenimiento.listarMantenimiento();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.mantenimiento) {
      const mantenimientoRecienteId = obtenerMantenimientoReciente();

      // Ordenar los mantenimientos por el mantenimiento más reciente primero
      rows.value = res.data.mantenimiento.sort((a, b) => {
        if (a._id === mantenimientoRecienteId) return -1;
        if (b._id === mantenimientoRecienteId) return 1;
        return 0; // Mantener el orden por defecto si no se encuentra el mantenimiento reciente
      });

      console.log("Mantenimientos ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar mantenimientos:", error);
  }
}


onMounted(()=>{
  listarMaquina(), listarMantenimiento();
})

import { useStoreMaquina } from "../store/maquinas.js";
const useMaquina = useStoreMaquina();

const organizarMaquinas = computed(() => {
    nombreCodigo.value = maquinaTodo.value.map((element) => ({
        label: `${element.codigo} - ${element.descripcion}`,
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
  return mantenimiento ? `${mantenimiento.codigo} - ${mantenimiento.descripcion}` : "mantenimiento no encontrado";
}

   const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
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
  
      <button class="button" @click="agregarmantenimiento()">Agregar Mantenimiento</button>

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
          </q-td>
        </template>
      </q-table>
    
  <div  class="filtro" v-if="agregar"> 
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Mantenimiento</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
        <q-select standout v-model="idMantenimiento" :options="organizarMaquinas" option-value="valor" option-label="label" label="Máquina" style="background-color: #grey; margin-bottom: 20px"
      />
        <!-- <input class="input" type="date" placeholder="Fecha" v-model.trim="fecha" /> -->
        <input class="input" type="text" placeholder="Descripción" v-model.trim="descripcion" />
        <input class="input" type="text" placeholder="Responsable" v-model.trim="responsable" />
        <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />
    </div>
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" :loading="useMantenimiento.loading" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarmantenimiento()" :loading="useMantenimiento.loading" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>


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
