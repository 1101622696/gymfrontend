<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreClientes } from "../store/clientes.js";
import { useStorePlanes } from "../store/planes.js";
import { useQuasar } from 'quasar'



const $q = useQuasar();

const usePlan = useStorePlanes();
let agregar = ref(false);
const useCliente = useStoreClientes();

let nombre = ref("");
let documento = ref("");
let direccion = ref("");
let fechaNacimiento = ref("");
let telefono = ref("");
let idplan = ref("");
let foto = ref("");
let planesTodo = ref([]);
let nombreCodigo = ref([]);

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
]);


function llamaragregarCliente() {   
  agregar.value = true;
}


async function guardar() {
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
          <p v-if="props.row.estado == 1" style="color:green">Activo</p>
          <p v-else style="color:red">Inactivo</p>
        </q-td>
      </template>
    </q-table>

    <!-- <button class="button" @click="listarClientes()">Traer Datos</button> -->
    <button class="button" @click="llamaragregarCliente()">Agregar Cliente</button>

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
      </div>
      <button class="button" @click="agregarCliente()" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
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

</style>
