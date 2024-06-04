<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreClientes } from "../store/clientes.js";
import { useStorePlanes } from "../store/planes.js";
import { useQuasar } from 'quasar'



const $q = useQuasar();

const usePlan = useStorePlanes();
let agregar = ref(false);
const useCliente = useStoreClientes();

let botoneditar=ref(false)
let mostrarFoto = ref(false)


function llamaragregarCliente(){
  botoneditar.value=true
    agregar.value = true;

nombre.value=""
documento.value=""
direccion.value=""
fechaNacimiento.value=""
telefono.value=""
idplan.value=""
foto.value=""

}


async function guardar(){

agregar.value = true;
if (await validar()){
  const todo={
    nombre:nombre.value,
    documento:documento.value,
    direccion:direccion.value,
    fechaNacimiento:fechaNacimiento.value,
    telefono:telefono.value,
    idplan:idplan.value,
    foto:foto.value

    }
let nombrez= await useCliente.postCliente(todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
listarClientes(), listarPlanes()}
}
}

function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info

nombre.value=informacion.value
documento.value=informacion.value
direccion.value=informacion.value
fechaNacimiento.value=informacion.value
telefono.value=informacion.value
idplan.value=informacion.value
foto.value=informacion.value

}

async function editarcliente(){
if (await validar()){
  const todo={
    nombre:nombre.value,
    documento:documento.value,
    direccion:direccion.value,
    fechaNacimiento:fechaNacimiento.value,
    telefono:telefono.value,
    idplan:idplan.value,
    foto:foto.value


    }
let nombrez= await useCliente.putCliente(informacion._id, todo)
if(nombrez.status!=200){
  mostrarMensajeError("no se pudo enviar")
}else{
  mostrarMensajeExito("muy bien")
listarClientes(), listarPlanes()}
}
}

async function editarestado(info){
if(info.estado == 1){
let desactivado= await useCliente.putDesactivarCliente(info._id)
}else if(info.estado == 0){
let activado= await useCliente.putActivarCliente(info._id)
}
listarClientes()
}

let informacion=ref("")
let nombre = ref("");
let documento = ref("");
let direccion = ref("");
let fechaNacimiento = ref("");
let telefono = ref("");
let idplan = ref("");
let foto = ref("");
let planesTodo = ref([]);
let nombreCodigo = ref([]);
let seguimientos = ref([{
      fecha: '',
      peso: '',
      imc: '',
      brazo: '',
      pierna: '',
      edad: ''
    }])

let rows = ref([]);
let columns = ref([
      {name:"idPlan", label:"Plan", field:"idPlan", align:"center"},
  { name: "nombre", sortable: true, label: "Nombre Cliente", field: "nombre", align: "center" },
  { name: "direccion", label: "Direccion", field: "direccion", align: "center" },
  { name: "documento", label: "Documento", field: "documento", align: "center" },
  { name: "fechaNacimiento", label: "fecha de Nacimiento", field: "fechaNacimiento", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "foto", label: "Foto", field: "foto", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "seguimiento", label: "Seguimiento", field: "seguimiento", align: "center" },

]);


async function validar() {
    let verificado = true;

    if (nombre.value === "") {
        mostrarMensajeError("El nombre está vacío");
        verificado = false;
    }
    if (documento.value === "") {
        mostrarMensajeError("El tipo de documento está vacío");
        verificado = false;
    }
    if (direccion.value === "") {
        mostrarMensajeError("La dirección está vacía");
        verificado = false;
    } else if (!isNaN(direccion.value) || direccion.value < 0) {
        mostrarMensajeError("La dirección debe ser un número válido");
        verificado = false;
    }
    if (fechaNacimiento.value === "") {
        mostrarMensajeError("La fecha de nacimiento está vacía");
        verificado = false;
    } else {
        let fechaNacimientoDate = new Date(fechaNacimiento.value);
        let fechaActual = new Date();
        let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
        if (fechaActual.getMonth() < fechaNacimientoDate.getMonth() || (fechaActual.getMonth() === fechaNacimientoDate.getMonth() && fechaActual.getDate() < fechaNacimientoDate.getDate())) {
            edad--;
        }
        if (edad < 12) {
            mostrarMensajeError("Debes tener al menos 12 años");
            verificado = false;
        }
    }
    if (telefono.value === "") {
        mostrarMensajeError("El teléfono está vacío");
        verificado = false;
    } else if (isNaN(telefono.value) || telefono.value < 0 || telefono.value.length < 10) {
        mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
        verificado = false;
    }
    if (idplan.value === "") {
        mostrarMensajeError("El plan está vacío");
        verificado = false;
    }
    if (foto.value === "") {
        mostrarMensajeError("Debe ingresar un link para la foto");
        verificado = false;
    }

    for (let i = 0; i < seguimientos.length; i++) {
    const seguimiento = seguimientos[i];

    if (seguimiento.fecha === "") {
      mostrarMensajeError(`La fecha del seguimiento ${i + 1} está vacía`);
      verificado = false;
    }

    if (isNaN(seguimiento.peso) || seguimiento.peso < 0) {
      mostrarMensajeError(`El peso del seguimiento ${i + 1} debe ser un número válido`);
      verificado = false;
    }
        if (isNaN(seguimiento.imc) || seguimiento.imc < 0) {
      mostrarMensajeError(`El imc del seguimiento ${i + 1} debe ser un número válido`);
      verificado = false;
    }
        if (isNaN(seguimiento.brazo) || seguimiento.brazo < 0) {
      mostrarMensajeError(`El brazo del seguimiento ${i + 1} debe ser un número válido`);
      verificado = false;
    }
        if (isNaN(seguimiento.pierna) || seguimiento.pierna < 0) {
      mostrarMensajeError(`El pierna del seguimiento ${i + 1} debe ser un número válido`);
      verificado = false;
    }
        if (isNaN(seguimiento.edad) || seguimiento.edad < 0) {
      mostrarMensajeError(`El edad del seguimiento ${i + 1} debe ser un número válido`);
      verificado = false;
    }
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


async function listarClientes() {
  try {
    const res = await useCliente.listarCliente();
    rows.value = res.data.cliente.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}

function getPlanCodigo(id) {
  const plan = planesTodo.value.find(plan => plan._id === id);
  return plan ? plan.codigo : '';
}

  onMounted(()=>{
  listarClientes(), listarPlanes()
})

const organizarPlanes = computed(() => {
    nombreCodigo.value = planesTodo.value.map((element) => ({
        label: `${element.codigo}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigo.value;
});


async function listarPlanes() {
    try {
    const res = await usePlan.listarPlan()
       planesTodo.value = res.data.plan;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}

function cerrar() {
  agregar.value = false;
} 

   const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    const seguimientoColumns = ref([
      { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' },
      { name: 'peso', label: 'Peso', field: 'peso', align: 'center' },
      { name: 'imc', label: 'IMC', field: 'imc', align: 'center' },
      { name: 'brazo', label: 'Brazo', field: 'brazo', align: 'center' },
      { name: 'pierna', label: 'Pierna', field: 'pierna', align: 'center' },
      { name: 'edad', label: 'Edad', field: 'edad', align: 'center' }
    ]);

    const seguimientoModalOpen = ref(false);
    const selectedCliente = ref(null);
      let  clienteSeleccionado=ref(null);


    const openSeguimientoModal = (cliente) => {
      selectedCliente.value = cliente;
      seguimientoModalOpen.value = true;
    };

    const formateDate = (date) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    };
    const verFoto = (cliente) => {
      clienteSeleccionado.value = cliente
    }
</script>

<template>
  <div class="container">
    <q-table class="table" flat bordered title="Clientes" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-idPlan="props">
        <q-td :props="props">
          <p>{{ getPlanCodigo(props.row.idPlan) }}</p>
        </q-td>
      </template>
            <template v-slot:body-cell-fechaNacimiento="props">
        <q-td :props="props">
          <p>{{ formatDate(props.row.fechaNacimiento) }}</p>
        </q-td>
      </template>
<!-- <template v-slot:body-cell-foto="props">
  <q-td :props="props">
    <div class="photo-container">
      <q-btn class="fotico" @click="mostrarFoto = true">
        Vea la foto aquí
      </q-btn>
    </div>
    <div v-if="mostrarFoto" class="foto-modal">
      <div class="foto-modal-contenedor">
        <img :src="props.row.foto" class="foto-modal-imagen" />
        <q-btn color="primary" @click="mostrarFoto = false" class="cierrefoto">X</q-btn>

      </div>
    </div>
  </q-td>
</template> -->
        <!-- <q-btn color="primary" @click="mostrarFoto = false" class="foto-modal-cerrar">X</q-btn> -->

        <template v-slot:body-cell-foto="props">
  <q-td :props="props">
    <div class="photo-container">
      <q-btn class="fotico" @click="verFoto(props.row)">
        Vea la foto aquí
      </q-btn>
    </div>
    <div v-if="clienteSeleccionado !== null" class="foto-modal">
      <div class="foto-modal-contenedor">
        <img :src="clienteSeleccionado.foto" class="foto-modal-imagen" />
        <q-btn color="primary" @click="clienteSeleccionado = null" class="foto-modal-cerrar">X</q-btn>
      </div>
    </div>
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
 <template v-slot:body-cell-seguimiento="props">
        <q-td :props="props">
          <q-btn class="segui" @click="openSeguimientoModal(props.row)">
            Seguimiento
          </q-btn>
        </q-td>
      </template>
    <!-- <q-table class="table" v-if="irseguimiento == true" flat bordered title="Clientes" :rows="rows" :columns="columns" row-key="id">
    </q-table> -->

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
    <button class="button" @click="llamaragregarCliente()">Agregar Cliente</button>


<q-dialog v-model="seguimientoModalOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ selectedCliente?.nombre }}</div>
        </q-card-section>
        <q-card-section>
          <q-avatar size="150px">
            <img :src="selectedCliente?.foto" />
          </q-avatar>
          <q-table
            flat
            bordered
            :rows="selectedCliente?.seguimiento || []"
            :columns="seguimientoColumns"
            row-key="fecha"
          >
            <template v-slot:body-cell-fecha="props">
              <q-td :props="props">
                {{ formatDate(props.row.fecha) }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <div class="crearcliente" v-if="agregar">
      <div class="encabezadoCrear">
        <h3>Ingresar Clientes</h3>
        <button class="buttonX" @click="cerrar()">X</button>
      </div>
      <div class="inputs">
        <input class="input" type="text" placeholder="Nombre" v-model.trim="nombre" />
        <input class="input" type="text" placeholder="N° Documento" v-model.trim="documento" />
        <input class="input" type="text" placeholder="Dirección" v-model.trim="direccion" />
        <input class="input" type="date" placeholder="Fecha de Nacimiento" v-model.trim="fechaNacimiento" />
        <input class="input" type="text" placeholder="Teléfono" v-model.trim="telefono" />
       <q-select standout v-model="idPlan" :options="organizarPlanes" option-value="valor" option-label="label" label="Plan"  style="background-color: #grey; margin-bottom: 20px"
      />
        <input class="input" type="text" placeholder="Foto" v-model.trim="foto" />
          <div v-for="(seguimiento, index) in seguimientos" :key="index">
    <h4>Seguimiento {{ index + 1 }}</h4>
    <input class="input" type="date"   :placeholder="'Formato: DD/MM/YYYY'" v-model.trim="seguimiento.fecha" />
    <input class="input" type="number" placeholder="Peso" v-model.number="seguimiento.peso" />
    <input class="input" type="number" placeholder="IMC" v-model.number="seguimiento.imc" />
    <input class="input" type="number" placeholder="Brazo" v-model.number="seguimiento.brazo" />
    <input class="input" type="number" placeholder="Pierna" v-model.number="seguimiento.pierna" />
    <input class="input" type="number" placeholder="Edad" v-model.number="seguimiento.edad" />
  </div>
      </div>
    <button v-if="botoneditar == true" class="button" @click="guardar()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarcliente()" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>
    </div>
  </div>
</template>

<style scoped>

/* Estilos para el contenedor principal */
.container {
  width: 90vmax;
  margin: 0 auto;
  min-height: 100vh;
  width: 99.1vw;
background-color: rgb(185, 185, 185);
}


.foto-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.5); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.foto-modal-contenedor {
  position: relative;
   background-color: rgb(226, 226, 226);
  /*padding: 20px;
  border-radius: 8px; */
  max-width: 400px;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.foto-modal-imagen {
  max-width: 50%;
  max-height: 50%;
  object-fit: contain;
}
.foto-modal-cerrar {
  position: absolute;
  top: 30px;
  right: 30px;
}

/* estilos para el nombre dentro del seguimiento */
.text-h6{
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-transform: uppercase;
}
/* Estilos para el título */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
/**/
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

</style>
