<script setup>
import { ref, onMounted, computed } from "vue";
import { useStorePagos } from "../store/pagos.js";
import { useStoreClientes } from "../store/clientes.js";


const usePagos = useStorePagos();
const useCliente = useStoreClientes();


let agregar=ref(false)
let botoneditar=ref(false)

function agregarpago(){
  botoneditar.value=true
    agregar.value = true;

id.value=""
plan.value=""
fecha.value=""
valor.value=""
}


async function guardar(){

agregar.value = true;
if (await validar()){
  const todo={
    id:id.value,
    plan:plan.value,
    fecha:fecha.value,
    valor:valor.value
    }
let nombrez= await usePagos.postPago(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo eniar")
}else{
  mostrarMensajeExito("muy bien")
  listarPagos(), listarClientes()
}
}
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info
id.value=informacion.value
plan.value=informacion.value
fecha.value=informacion.value
valor.value=informacion.value
}

async function editarpago(){
if (await validar()){
  const todo={
    id:id.value,
    plan:plan.value,
    fecha:fecha.value,
    valor:valor.value

    }
let nombrez= await usePagos.putPago(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo eniar")
}else{
  mostrarMensajeExito("muy bien")
  listarPagos(), listarClientes()
}
}
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await usePagos.putDesactivarPago(info._id)
}else if(info.estado == 0){
let activado= await usePagos.putActivarPago(info._id)
}
listarPagos()
}

function cerrar(){
    agregar.value = false;
}
let informacion=ref("")
let id = ref("");
let plan = ref("");
let fecha = ref("");
let valor = ref("");
let clientesTodo = ref([]);
let nombreCodigo = ref([]);
let rows = ref([]);
let columns = ref([
      { name: "id", label: "Cliente", field: "id", align: "center" },
      { name: "plan", sortable: true, label: "Plan", field: "plan", align: "center" },
      { name: "fecha", label: "Fecha del pago", field: "fecha", align: "center" },
      { name: "valor", label: "Valor", field: "valor", align: "center" },
      { name: "estado", label: "Estado del pago", field: "estado", align: "center" },
      { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
    ]);

async function validar() {
    let verificado = true;

    if (id.value === "") {
        mostrarMensajeError("Seleccione un cliente");
        verificado = false;
    }
    if (plan.value === "") {
        mostrarMensajeError("escriba el plan");
        verificado = false;
    }
    if (fecha.value === "") {
        mostrarMensajeError("La fecha está vacía");
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


async function listarPagos() {
      try {
        const res = await usePagos.listarPago();
        console.log("Pagos:", res.data);
        rows.value = res.data.pago.map((pago) => ({
          ...pago,
          clienteDocumento: getClienteDocumento(pago.id),
        }));
      } catch (error) {
        console.error("Error al listar pagos:", error);
      }
    }

    onMounted(async () => {
      await listarClientes();
      await listarPagos();
    });

const organizarClientes = computed(() => {
  nombreCodigo.value = clientesTodo.value.map((element) => ({
    label: `${element.documento}`,
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
  const cliente = clientesTodo.value.find((cliente) => cliente._id === id);
  console.log(id);
  console.log(clientesTodo.value);

  return cliente ? cliente.documento : "Documento no encontrado";
}

    function formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    }

</script>

<template>
    <div class="container">
  
      <q-table class="table" flat bordered title="Pagos" :rows="rows" :columns="columns" row-key="id">
<template v-slot:body-cell-id="props">
      <q-td :props="props">
          <p>{{ getClienteDocumento(props.row.id) }}</p>
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
    
      <button class="button" @click="agregarpago()">Agregar Pago</button>
  
      <div class="crearcliente" v-if="agregar">
        <div class="encabezadoCrear">
        <h3>Ingresar Pago</h3>
        <button class="buttonX" @click="cerrar()">X</button>
    </div>
    <div class="inputs">
               <q-select standout v-model="id" :options="organizarClientes" option-value="valor" option-label="label" label="Cliente"         style="background-color: #grey; margin-bottom: 20px"
      />
        <input class="input" type="text" placeholder="Plan" v-model.trim="plan" />
        <input class="input" type="date" placeholder="Fecha de pago" v-model.trim="fechaPago" />
        <input class="input" type="text" placeholder="Valor" v-model.trim="valor" />
    </div>
    
    
    <button v-if="botoneditar ==true" class="button" @click="guardar()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarpago()" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>

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


<!--import mongoose from "mongoose"; const pagosSchema=new mongoose.Schema({ id:{type:mongoose.Schema.Types.ObjectId,ref:'Cliente',required:true}, plan:{type:String,required:true}, fecha:{type:Date,default:Date.now()}, valor:{ type: Number, require: true }, estado:{type:Number,default:1}, }) export default mongoose.model("Pago",pagosSchema) import mongoose from "mongoose"; const clientesSchema = new mongoose.Schema({ nombre: { type: String, require: true }, fechaIngreso: { type: Date, default: Date.now()}, documento: { type: String, required: true, unique: true }, direccion: { type: String, required: true }, fechaNacimiento: { type: Date, required: true }, telefono: { type: String, required: true}, estado: { type: Number, default: 1 }, idPlan:{type:mongoose.Schema.Types.ObjectId,ref:'Plan',required:true}, fechavencimiento: { type: Date, default:"" }, foto: { type: String, required: true }, seguimiento: [ { fecha: { type: Date, required: true }, peso: { type: Number, require: true }, imc: { type: Number, require: true }, brazo: { type: Number, require: true }, pierna: { type: Number, require: true }, edad: { type: Number, require: true }, }, ], }); export default mongoose.model("Cliente",clientesSchema); y estos son los modelos de pago y clientesD{ "pago": [ { "_id": "66393c34ffdb17b805327eb6", "id": "6633f7590eb25b349327248e", "plan": "2", "fecha": "2001-05-12T05:00:00.000Z", "valor": 2000, "estado": 1, "__v": 0 } ] } al momento de listar pagos en postman me salen estos datos, { "cliente": [ { "_id": "6639445ef23880b5ca0345ae", "nombre": "giselleDaniela", "fechaIngreso": "2024-05-06T20:57:24.786Z", "documento": "267667677676", "direccion": "carrera 8#15-10", "fechaNacimiento": "2001-05-12T05:00:00.000Z", "telefono": "9090909090", "estado": 1, "idPlan": "6633f5b89f21cef1c58e4994", "fechavencimiento": null, "foto": "fotoG", "seguimiento": [ { "fecha": "2020-08-08T05:00:00.000Z", "peso": 40, "imc": 30, "brazo": 30, "pierna": 40, "edad": 30, "_id": "6639445ef23880b5ca0345af" } ], "__v": 0 }, { "_id": "663d1be7b093f46f12b4970c", "nombre": "Meghan", "fechaIngreso": "2024-05-09T18:46:58.575Z", "documento": "0777777777", "direccion": "carrera 8#15-10", "fechaNacimiento": "2001-05-12T05:00:00.000Z", "telefono": "9090909090", "estado": 1, "idPlan": "6633f5b89f21cef1c58e4994", "fechavencimiento": null, "foto": "fotoG", "seguimiento": [ { "fecha": "2020-08-08T05:00:00.000Z", "peso": 40, "imc": 30, "brazo": 30, "pierna": 40, "edad": 30, "_id": "663d1be7b093f46f12b4970d" } ], "__v": 0 }, { "_id": "663d1d70e621e965b65987b6", "nombre": "Haylie", "fechaIngreso": "2024-05-09T19:01:00.398Z", "documento": "0777777770", "direccion": "carrera 8#15-10", "fechaNacimiento": "2001-05-12T05:00:00.000Z", "telefono": "337-697-4243", "estado": 0, "idPlan": "6633f5b89f21cef1c58e4994", "fechavencimiento": null, "foto": "http://loyal.com", "seguimiento": [ { "fecha": "2020-08-08T05:00:00.000Z", "peso": 40, "imc": 30, "brazo": 30, "pierna": 40, "edad": 30, "_id": "663d1d70e621e965b65987b7" } ], "__v": 0 }, { "_id": "663d1dc3e621e965b65987bf", "nombre": "Cathrine", "fechaIngreso": "2024-05-09T19:01:00.398Z", "documento": "0777777707", "direccion": "carrera 8#15-10", "fechaNacimiento": "2001-05-12T05:00:00.000Z", "telefono": "434-672-4197", "estado": 1, "idPlan": "6633f5b89f21cef1c58e4994", "fechavencimiento": null, "foto": "http://rita.org", "seguimiento": [ { "fecha": "2020-08-08T05:00:00.000Z", "peso": 40, "imc": 30, "brazo": 30, "pierna": 40, "edad": 30, "_id": "663d1dc3e621e965b65987c0" } ], "__v": 0 } ] } y estos son los clientes<template>
  <template v-slot:body-cell-id="props">
    <q-td :props="props">
      <p>{{ getClienteDocumento(props.row.id) }}</p>
    </q-td>
  </template>
</template>let id = ref("");
let plan = ref("");
let fecha = ref("");
let valor = ref("");
let clientesTodo = ref([]);
let nombreCodigo = ref([]);
let rows = ref([]);
let columns = ref([
  { name: "id", label: "Cliente", field: "id", align: "center" },
  { name: "plan", sortable: true, label: "Plan", field: "plan", align: "center" },
  { name: "fecha", label: "Fecha del pago", field: "fecha", align: "center" },
  { name: "valor", label: "Valor", field: "valor", align: "center" },
  { name: "estado", label: "Estado del pago", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

async function listarPagos() {
  try {
    const res = await usePagos.listarPago();
    console.log("Pagos:", res.data);
    rows.value = res.data.pago;
  } catch (error) {
    console.error("Error al listar pagos:", error);
  }
}

onMounted(async () => {
  await listarClientes();
  await listarPagos();
  // Mapping rows after ensuring clients are loaded
  rows.value = rows.value.map((pago) => ({
    ...pago,
    clienteDocumento: getClienteDocumento(pago.id),
  }));
});

const organizarClientes = computed(() => {
  nombreCodigo.value = clientesTodo.value.map((element) => ({
    label: `${element.documento}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
  return nombreCodigo.value;
});

async function listarClientes() {
  try {
    const res = await useCliente.listarCliente();
    console.log("Clientes:", res.data);
    clientesTodo.value = res.data.cliente;
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}

function getClienteDocumento(id) {
  console.log("buscando cliente con ID:", id);
  const cliente = clientesTodo.value.find((cliente) => cliente._id === id);
  if (cliente) {
    console.log("cliente encontrado:", cliente);
  } else {
    console.log("cliente no encontrado para el ID:", id);
  }
  return cliente ? cliente.documento : "Documento no encontrado";
}-->