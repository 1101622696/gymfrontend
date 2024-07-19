<script setup>
import { ref, onMounted, computed } from "vue";
import { useStoreClientes } from "../store/clientes.js";
import { useStorePlanes } from "../store/planes.js";
import { useQuasar } from 'quasar'



const $q = useQuasar();

const usePlan = useStorePlanes();
const useCliente = useStoreClientes();

let agregar = ref(false);
let botoneditar=ref(false)
let mostrarFoto = ref(false)
let nivelimc = ref(false)



function llamaragregarCliente() {
  botoneditar.value = true; 
  agregar.value = true;

  nombre.value = "";
  documento.value = "";
  direccion.value = "";
  fechaNacimiento.value = "";
  telefono.value = "";
  observaciones.value = "";
  idPlan.value = "";
  foto.value = "";
  // seguimientos.value = [{ fecha: '', peso: '', imc: '', brazo: '', altura: '', edad: '' }];
}

function guardarClienteReciente(id) {
  localStorage.setItem('clienteReciente', id);
}

function obtenerClienteReciente() {
  return localStorage.getItem('clienteReciente');
}

async function guardar() {
  if (await validar()) {
    const todo = {
      nombre: nombre.value,
      documento: documento.value,
      direccion: direccion.value,
      fechaNacimiento: fechaNacimiento.value,
      telefono: telefono.value,
      observaciones: observaciones.value,
      idPlan: idPlan.value.valor,
      foto: foto.value,
    };

    console.log(nombre.value);
    console.log(direccion.value);
    console.log(fechaNacimiento.value);
    console.log(telefono.value);
    console.log(idPlan.value);

    try {
      let response = await useCliente.postCliente(todo);
      console.log('Respuesta del servidor:', response);

      if (response.status === 200 && response.data && response.data.cliente) {
        const nuevoCliente = response.data.cliente;

        console.log('Nuevo cliente a añadir:', nuevoCliente);

        guardarClienteReciente(nuevoCliente._id);

        rows.value.unshift(nuevoCliente);

        console.log('Filas actualizadas:', rows.value);

        mostrarMensajeExito("Cliente agregado exitosamente");
        
        await listarClientes();
        await listarPlanes();
  agregar.value = false;

      } else {
        console.error('Respuesta inesperada del servidor:', response);
        mostrarMensajeError("No se pudo agregar el cliente");
      }
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      mostrarMensajeError("Ocurrió un error al guardar el cliente");
    }
  }
}


function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info

nombre.value=info.nombre
documento.value=info.documento
direccion.value=info.direccion
    const date = new Date(info.fechaNacimiento);
    const formattedDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    fechaNacimiento.value = formattedDate;
telefono.value=info.telefono
observaciones.value=info.observaciones
    const selectedPlan = planesTodo.value.find(plan => plan._id === info.idPlan);
    if (selectedPlan) {
        idPlan.value = {
            label: `${selectedPlan.codigo} - ${selectedPlan.descripcion}`, 
            valor: selectedPlan._id, 
            nombre: selectedPlan.nombre  
        };
    }foto.value=info.foto

}


async function editarcliente() {
  if (await validar()) {
    const todo = {
      nombre: nombre.value,
      documento: documento.value,
      direccion: direccion.value,
      fechaNacimiento: fechaNacimiento.value,
      telefono: telefono.value,
      observaciones: observaciones.value,
      idPlan: idPlan.value.valor,
      foto: foto.value,
    };

    try {
     const response = await useCliente.putCliente(informacion.value._id, todo);
    if (response.status === 200) {
      mostrarMensajeExito("Cliente actualizado exitosamente");
      listarClientes();
      listarPlanes();
  agregar.value = false;

    } else {
      mostrarMensajeError("No se pudo actualizar el cliente");
    }
  }catch (error) {
      console.error("Error al actualizar el cliente:", error);
      mostrarMensajeError("No se pudo enviar");
    }
}
}
async function editarestado(info){
  console.log("holaa", info);
if(info.estado == 1){
let desactivado= await useCliente.putDesactivarCliente(info._id)
console.log(desactivado);
}else if(info.estado == 0){
let activado= await useCliente.putActivarCliente(info._id)
console.log(activado);

}
listarClientes()
}

let informacion=ref("")
let nombre = ref("");
let documento = ref("");
let direccion = ref("");
let fechaNacimiento = ref("");
let telefono = ref("");
let observaciones = ref("");
let idPlan = ref("");
let foto = ref("");
let seguimiento = ref("");


let clienteTodo= ref(null)
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
  { name: "observaciones", label: "Observaciones del Cliente", field: "observaciones", align: "center" },
  { name: "foto", label: "Foto", field: "foto", align: "center" },
  { name: "fechavencimiento", label: "fecha de vencimiento", field: "fechavencimiento", align: "center" },
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
  if (telefono.value === "" || isNaN(telefono.value) || telefono.value < 0 || telefono.value.length < 10) {
    mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
    verificado = false;
  }
  if (idPlan.value === "") {
    mostrarMensajeError("El plan está vacío");
    verificado = false;
  }
    if (observaciones.value === "") {
    mostrarMensajeError("digite las observaciones");
    verificado = false;
  }
  if (foto.value === "") {
    mostrarMensajeError("Debe ingresar un enlace para la foto");
    verificado = false;
  }

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


// async function listarClientes() {
//   try {
//     const res = await useCliente.listarCliente();
//     rows.value = res.data.cliente.map(cliente => ({
//       ...cliente,
//       idPlan: cliente.idPlan, 
//     }));
//   } catch (error) {
//     console.error("Error al listar clientes:", error);
//   }
// }


async function listarClientes() {
  try {
    const res = await useCliente.listarCliente();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.cliente) {
      const clienteRecienteId = obtenerClienteReciente();
      
      // Ordenar los clientes
      rows.value = res.data.cliente.map(cliente => ({
        ...cliente,
        idPlan: cliente.idPlan,
      })).sort((a, b) => {
        if (a._id === clienteRecienteId) return -1;
        if (b._id === clienteRecienteId) return 1;
        return new Date(b.fechaNacimiento) - new Date(a.fechaNacimiento);
      });

      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}


async function listaractivados() {
  try {
    const res = await useCliente.listaractivados();
    rows.value = res.data.activados.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}



async function listardesactivados() {
  try {
    const res = await useCliente.listardesactivados();
    rows.value = res.data.desactivados.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
    console.log(res)
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}

async function buscarClientesPorNombre() {
  try {
    const res = await useCliente.listarCliente(listNombre.value);
    rows.value = res.data.cliente.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
    console.log(res);
  } catch (error) {
    console.error("Error al buscar clientes por nombre:", error);
  }
};

const planSeleccionado = ref("");

async function buscarClientesporPlan() {
  try {
    const res = await useCliente.listarClientesporPlan(planSeleccionado.value);
    rows.value = res.data.clientes.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
    console.log(res);
  } catch (error) {
    console.error("Error al buscar clientes por plan:", error);
    console.log(planSeleccionado.value,"sjdbfkjsdbf")
  }
};

let diacumple = ref(""); //
let mescumple = ref("");

async function buscarClientesporCumpleanos() {
  try {
    const dia = parseInt(diacumple.value);
    const mes = parseInt(mescumple.value);

    console.log(`Buscando clientes nacidos el día ${dia} del mes ${mes}`);

    const res = await useCliente.listarClientesporCumpleanos(dia, mes);
    
    if (res.clientes && Array.isArray(res.clientes)) {
      rows.value = res.clientes.map(cliente => ({
        ...cliente,
        idPlan: cliente.idPlan,
      }));
      
      if (rows.value.length === 0) {
        mostrarMensajeError("No se encontraron clientes con esa fecha de cumpleaños");
      } else {
        mostrarMensajeExito(`Se encontraron ${rows.value.length} clientes`);
      }
    } else {
      mostrarMensajeError("La respuesta del servidor no es válida");
    }
  } catch (error) {
    console.error("Error al buscar clientes por cumpleaños:", error);
    mostrarMensajeError("Ocurrió un error al buscar clientes. Por favor, intente de nuevo.");
  }
}
function ejecutarlistcumple() {
  const dia = parseInt(diacumple.value);
  const mes = parseInt(mescumple.value);

  if (isNaN(dia) || dia < 1 || dia > 31) {
    mostrarMensajeError("Ingrese un día válido (entre 1 y 31)");
    return;
  }

  if (isNaN(mes) || mes < 1 || mes > 12) {
    mostrarMensajeError("Ingrese un mes válido (entre 1 y 12)");
    return;
  }

  // Validación adicional para meses con menos de 31 días
  if ((mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia > 30) {
    mostrarMensajeError("Este mes solo tiene 30 días");
    return;
  }

  if (mes === 2) {
    if (dia > 29) {
      mostrarMensajeError("Febrero no puede tener más de 29 días");
      return;
    }
    if (dia === 29) {
      mostrarMensajeError("Asegúrese de que es un año bisiesto");
    }
  }

  buscarClientesporCumpleanos();
}


function getPlanCodigo(id) {
  const plan = planesTodo.value.find(plan => plan._id === id);
  return plan ? `${plan.codigo} - ${plan.descripcion}` : '';
}

  onMounted(()=>{
  listarClientes(), listarPlanes()
})

// const organizarPlanes = computed(() => {
//     nombreCodigo.value = planesTodo.value.map((element) => ({
//         label: `${element.codigo} - ${element.descripcion}`,
//         valor: `${element._id}`,
//         nombre: `${element.nombre}`,
//     }));
//     return nombreCodigo.value;
// });


// async function listarPlanes() {
//     try {
//     const res = await usePlan.listarPlan()
//        planesTodo.value = res.data.plan;
//     } catch (error) {
//         console.error("Error al listar planes:", error);
//     }
// }
async function listarPlanes() {
    try {
        const res = await usePlan.listaractivados();
        planesTodo.value = res.data.activados;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}

const organizarPlanes = computed(() => {
    return planesTodo.value.map((element) => ({
        label: `${element.codigo} - ${element.descripcion}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
});

function cerrar() {
  agregar.value = false;
    } 




function formatDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

//  function formatDateNacimiento(fechaNacimiento) {
//   if (!fechaNacimiento) return 'Fecha no disponible';

//   const date = new Date(fechaNacimiento);
//   if (isNaN(date.getTime())) return 'Fecha inválida';

//   date.setDate(date.getDate() + 1);

//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return date.toLocaleDateString('es-ES', options);
// }


    const verFoto = (cliente) => {
      clienteSeleccionado.value = cliente
    }

    const ordenar= ref("Todos")
    let listNombre = ref("")
    let listP= ref(false);
    let listF= ref(false);
    let listN= ref(false);

function ejecutarFiltro() {

if (ordenar.value == 'Todos') {
  listarClientes();
  listP.value=false
  listF.value=false
  listN.value=false
} else if (ordenar.value == 'Activos') {
  listaractivados();
  listP.value=false
  listF.value=false
  listN.value=false
} else if (ordenar.value == 'Inactivos') {
  listardesactivados();
  listP.value=false
  listF.value=false
  listN.value=false
}
else if (ordenar.value == 'Plan') {
  listP.value=true
  listF.value=false
  listN.value=false
}
else if (ordenar.value == 'Fecha') {
  listF.value=true
  listP.value=false
  listN.value=false
}
else if (ordenar.value == 'Nombre') {
  listN.value=true
  listP.value=false
  listF.value=false
}};

function ejecutarlistnombre(){
buscarClientesPorNombre()
console.log(listNombre.value);
}

let segui = ref(false);
let currentClientId = ref(null);
const seguimientoModalOpen = ref(false);
const selectedCliente = ref(null);
let clienteSeleccionado = ref(null);
let infor = ref("");
// let botoneditar = ref(false);

const toggleSegui = () => {
  segui.value = !segui.value;
};
const cerrarformu = () => {
  segui.value = !segui.value;
};

const closeModal = () => {
  seguimientoModalOpen.value = false;
  segui.value = false;
};

const openSeguimientoModal = (cliente) => {
  console.log("Cliente seleccionado:", cliente);
  selectedCliente.value = cliente;
  seguimientoModalOpen.value = true;
};

const seguimientos = ref([{ peso: '', brazo: '', altura: '', edad: '' }]);

async function actualizarSegui() {
  if (await validarseguii()) {
    const todoz = { seguimiento: seguimientos.value };
    console.log("Datos a enviar:", JSON.stringify(todoz, null, 2));

    try {
      let seguiz = await useCliente.putClienteSeguimiento(selectedCliente.value._id, todoz);
      if (seguiz && seguiz.status === 200) {
        mostrarMensajeExito("Seguimiento agregado exitosamente");
        listarClientes();
        listarPlanes();
        closeModal();
      }
    } catch (error) {
      console.error("Error al actualizar seguimiento:", error);
      mostrarMensajeError("Error interno del servidor");
    }
  }
}

async function validarseguii() {
  let verificado = true;
  for (let i = 0; i < seguimientos.value.length; i++) {
    const seguimiento = seguimientos.value[i];
    if (isNaN(seguimiento.peso) || seguimiento.peso <= 0) {
      mostrarMensajeError(`El peso del seguimiento debe ser un número válido`);
      verificado = false;
    }
    if (isNaN(seguimiento.brazo) || seguimiento.brazo <= 0) {
      mostrarMensajeError(`El brazo del seguimiento debe ser un número válido`);
      verificado = false;
    }
    if (isNaN(seguimiento.altura) || seguimiento.altura <= 0) {
      mostrarMensajeError(`La altura debe ser un número válido`);
      verificado = false;
    }
    if (isNaN(seguimiento.edad) || seguimiento.edad <= 0) {
      mostrarMensajeError(`La edad del seguimiento debe ser un número válido`);
      verificado = false;
    }
  }

  if (verificado) {
    mostrarMensajeExito("El Seguimiento se envió correctamente");
  }

  return verificado;
}

const seguimientoColumns = ref([
  { name: "edita", label: "Editar", field: "edita", align: "center" },
  { name: 'peso', label: 'Peso', field: 'peso', align: 'center' },
  { name: 'imc', label: 'IMC', field: 'imc', align: 'center' },
  { name: 'brazo', label: 'Brazo', field: 'brazo', align: 'center' },
  { name: 'altura', label: 'Altura', field: 'altura', align: 'center' },
  { name: 'edad', label: 'Edad', field: 'edad', align: 'center' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' },
]);

function editarsegui(inf) {
  segui.value = true;
  infor.value = inf;
  botoneditar.value = true;
  seguimientos.value = [{ ...inf }];
}

async function editaseguimiento() {
  if (await validarseguii()) {
    const seguimientoData = {
      peso: seguimientos.value[0].peso,
      brazo: seguimientos.value[0].brazo,
      altura: seguimientos.value[0].altura,
      edad: seguimientos.value[0].edad
    };

    try {
      const response = await useCliente.putEditaSeguimiento(selectedCliente.value._id, infor.value._id, seguimientoData);
      mostrarMensajeExito("Seguimiento editado exitosamente");
      listarClientes();
      listarPlanes();
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el seguimiento:", error);
      mostrarMensajeError("No se pudo editar el seguimiento");
    }
  }
}

const getIMCStyle = (imc) => {
  if (imc < 18.5) {
    return { backgroundColor: '#3876d3', label: 'Bajo peso' };
  } else if (imc >= 18.5 && imc < 24.9) {
    return { backgroundColor: '#38db32', label: 'Normal' };
  } else if (imc >= 25 && imc < 29.9) {
    return { backgroundColor: 'orange', label: 'Sobrepeso' };
  } else if (imc >= 30) {
    return { backgroundColor: 'red', label: 'Obesidad' };
  }
  return { backgroundColor: 'white', label: '' };
};
</script>
<template>

<!-- esto es un tooltip -->
    <!-- <div
      style="width: 200px; height: 70px;"
      class="bg-purple text-white rounded-borders row flex-center q-mt-md"
    >
      Hover here or click buttons
      <q-tooltip v-model="showing">Tooltip text</q-tooltip>
    </div> -->

  <div class="container">

<div> 
    <button class="button" @click="llamaragregarCliente()">Agregar Cliente</button>
  </div>

    <div class="tablaselect">

      <div class="inputlistarn" v-if="listN">
      <input class="inputn" type="text" placeholder="Digite nombre" v-model.trim="listNombre" />
      <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
    </div>



      <div class="inputlistar" v-if="listP">
      <select v-model="planSeleccionado" @change="buscarClientesporPlan" class="custom-select2">
        <option disabled value="">Seleccione un plan</option>
        <option v-for="plan in planesTodo" :key="plan.id" :value="plan._id">{{ plan.descripcion }}</option>
      </select>
    </div>

   
<div class="inputlistarcumple" v-if="listF">
  <input class="inputc" type="number" placeholder="Digite día" v-model.number="diacumple" min="1" max="31" required />
  <input class="inputc" type="number" placeholder="Digite mes" v-model.number="mescumple" min="1" max="12" required />
  <button class="button" id="buttonf" @click="ejecutarlistcumple()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
</div>

  
      <select v-model="ordenar" @change="ejecutarFiltro" class="custom-select">
        <option value="Todos">Todos</option>
        <option value="Activos">Activos</option>
        <option value="Inactivos">Inactivos</option>
        <option value="Plan">Por Plan</option>
        <option value="Fecha">Por Cumpleaños</option>
        <option value="Nombre">Por Nombre</option>
      </select>
    </div>

    <q-table class="table" flat bordered title="Clientes" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-idPlan="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ getPlanCodigo(props.row.idPlan) }}</p>
        </q-td>
      </template>
<template v-slot:body-cell-fechaNacimiento="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ formatDate(props.row.fechaNacimiento) }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-fechavencimiento="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ formatDate(props.row.fechavencimiento) }}</p>
        </q-td>
      </template>

    <template v-slot:body-cell-observaciones="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
        <span class="truncated-text">
          {{ props.row.observaciones }}
          <q-tooltip anchor="bottom middle" self="top middle" :content="props.row.observaciones" transition-show="scale" transition-hide="scale">
            <span class="truncated-text">{{ props.row.observaciones }}</span>
          </q-tooltip>
        </span>
      </q-td>
    </template>

      <template v-slot:body-cell-foto="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <div class="photo-container">
            <q-btn class="fotico" @click="verFoto(props.row)">
              Ver foto
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
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <q-btn class="option-button" @click="editar(props.row)">
      ✏️
            <!-- <q-tooltip v-model="showing">Edita</q-tooltip> -->
    </q-btn>
    <q-btn @click="editarestado(props.row)" v-if="props.row.estado == 1" class="option-button" >
      ❌
            <q-tooltip v-model="showing">Desactivar</q-tooltip>

    </q-btn>
    <q-btn @click="editarestado(props.row)" v-else class="option-button">
      ✅
    </q-btn>
  </q-td>
</template>

<template v-slot:body-cell-seguimiento="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
        <q-btn class="segui" @click="openSeguimientoModal(props.row)">
          Seguimiento
            <!-- <q-tooltip v-model="showing">mira el seguimiento</q-tooltip> -->
        </q-btn>
      </q-td>
    </template>
      <template v-slot:body-cell-estado="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <q-btn v-if="props.row.estado == 1"  style="color:green">Activo</q-btn>
          <q-btn v-else  style="color:red">Inactivo</q-btn>
        </q-td>
      </template>
    </q-table>


<q-dialog v-model="seguimientoModalOpen" persistent>
  <q-card>
    <q-card-section>
      <div class="nombreyfoto">
        <div class="text-h6">{{ selectedCliente?.nombre }}</div>
        <q-avatar size="150px">
          <img :src="selectedCliente?.foto" />
        </q-avatar>
        <q-btn @click="toggleSegui" label="Agregar nuevo seguimiento" class="button" />
      </div>
      <q-table
        flat
        bordered
        :rows="selectedCliente?.seguimiento || []"
        :columns="seguimientoColumns"
        row-key="fecha"
      >
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            <p>{{ formatDate(props.row.fecha) }}</p>
          </q-td>
        </template>
        <template v-slot:body-cell-imc="props">
          <q-td :props="props" :style="{ backgroundColor: getIMCStyle(props.row.imc).backgroundColor }">
            <p class="option-button">{{ props.row.imc }}</p>
            <span>{{ getIMCStyle(props.row.imc).label }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-edita="props">
          <q-td :props="props">
            <div class="photo-container">
              <q-btn
                class="segui-modal-cerrar"
                @click="editarsegui(props.row)"
                style="margin-left: auto; margin-right: auto; display: block;"
              >
                ✏️
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="primary" @click="closeModal" />
    </q-card-actions>
  </q-card>

  <div v-if="segui" class="segui-modal" style="position: absolute; top: 50px; left: 50%; transform: translateX(-50%); background: white; padding: 20px; border: 1px solid #ccc; z-index: 10;">
    <div class="segui-modal-contenedor">
      <div class="formulariosegui">
        <div v-for="(seguimiento, index) in seguimientos" :key="index" >
          <h4 class="titulosegui">Seguimiento</h4>
      <q-input class="inputsegui" type="number" filled v-model.number="seguimiento.edad" label="Edad" :dense="dense" />
      <q-input class="inputsegui" type="number" filled v-model.number="seguimiento.altura" label="Altura (cm)" :dense="dense" />
      <q-input class="inputsegui" type="number" filled v-model.number="seguimiento.brazo" label="Brazo" :dense="dense" />
      <q-input class="inputsegui" type="number" filled v-model.number="seguimiento.peso" label="Peso" :dense="dense" />


        </div>
        <div class="botonesegui">
          <button v-if="botoneditar" class="button" @click="editaseguimiento" :loading="useCliente.loading" style="margin-left: auto; margin-right: auto; display: block;">
            Editar
          </button>
          <button v-else class="button" @click="actualizarSegui" :loading="useCliente.loading" style="margin-left: auto; margin-right: auto; display: block;">
            Agregar Seguimiento
          </button>
          <q-btn @click="toggleSegui" class="button" style="margin-left: auto; margin-right: auto; display: block;">
            Cerrar
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</q-dialog>


<div  class="filtro" v-if="agregar"> 
    <div class="crearcliente" v-if="agregar">
      <div class="encabezadoCrear">
        <h3>Ingresar Clientes</h3>
        <button class="buttonX" @click="cerrar()">X</button>
      </div>
      <div class="inputs">
      <q-input class="input" filled v-model.trim="nombre" label="Nombre" :dense="dense" />
      <q-input class="input" filled v-model.trim="documento" label="N° Documento" :dense="dense" />
      <q-input class="input" filled v-model.trim="direccion" label="Dirección" :dense="dense" />
        <!-- <input class="input" type="textarea" placeholder="Observaciones" v-model.trim="observaciones" /> -->
            <textarea class="input textarea" placeholder="Observaciones" v-model.trim="observaciones"></textarea>
<q-input class="input" filled type="date" v-model.trim="fechaNacimiento" label="fecha de Nacimiento" :dense="dense" />                <!-- <div class="input-container">
          <label for="fechaNacimiento">Fecha de Nacimiento</label>
          <input class="fechaNacimiento" type="date" v-model.trim="fechaNacimiento" />
        </div> -->
      <q-input class="input" filled v-model.trim="telefono" label="Teléfono" :dense="dense" />
        <q-select standout v-model="idPlan" :options="organizarPlanes" option-value="valor" option-label="label" label="Plan" style="background-color: #grey; margin-bottom: 20px" />
      <q-input class="input" filled v-model.trim="foto" label="Foto" :dense="dense" />

        <!-- <div v-for="(seguimiento, index) in seguimientos" :key="index">
          <h4>Seguimiento {{ index + 1 }}</h4>
          <input class="input" type="date" placeholder="Formato: DD/MM/YYYY" v-model.trim="seguimiento.fecha" />
          <input class="input" type="number" placeholder="Peso" v-model.number="seguimiento.peso" />
          <input class="input" type="number" placeholder="IMC" v-model.number="seguimiento.imc" />
          <input class="input" type="number" placeholder="Brazo" v-model.number="seguimiento.brazo" />
          <input class="input" type="number" placeholder="altura" v-model.number="seguimiento.altura" />
          <input class="input" type="number" placeholder="Edad" v-model.number="seguimiento.edad" />
        </div> -->
      </div>
       <button v-if="botoneditar ==true" class="button" @click="guardar()" :loading="useCliente.loading" style="margin-left: auto; margin-right: auto; display: block;">Guardar</button>
    <button v-else class="button" @click="editarcliente()" :loading="useCliente.loading" style="margin-left: auto; margin-right: auto; display: block;">Actualizar</button>
    </div> </div>
  </div>
</template>

<style scoped>

/* Estilos para el contenedor principal */
.container {
  width: 97vmax;
  margin: 0 auto;
  min-height:auto;
background-color: rgb(185, 185, 185);
overflow:hidden !important;
}

.container::-webkit-scrollbar {
  display: none !important; /* Oculta el scrollbar */
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
   /* background-color: rgb(226, 226, 226); */
   /* background-color: #3876d3; */

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

.fotoimc{
  width:90%;
  height:40%
}
.fotocerrar{
    width:10%;
  height: 10px;
  background-color: rgb(214, 55, 55);
  margin-top: 2%;
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
  background-color: #77c57b; 
  box-shadow: 3px 2px 10px black;
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
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
   margin-top: 1px; 
width: 50vmax;
height: 90vh;
overflow: scroll;
border-color: green;
margin-left: auto;
margin-right: auto;
position: absolute;
top: 54%;
left: 50%;
transform: translate(-50%,-50%);
}

/* -------------------------------------- */

.crearcliente::-webkit-scrollbar {
  width: 8px; 
  height: 8px; 
}

.crearcliente::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 2vmax; 
}

.crearcliente::-webkit-scrollbar-thumb {
  background: #888; 
  border-radius: 2vmax; 
}

.crearcliente::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

/* -------------------------------------- */


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
  width: 95%;
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
.nombreyfoto, .formulariosegui{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center ;
}

/* .formulariosegui{
color:black;
}
.inputsegui{
width: 60%;
height: 40px;
margin:2%;
margin-left: 20%;
border: 1px solid green
}
.titulosegui{
color: rgb(80, 80, 248);
font-family: 'Times New Roman', Times, serif;
font-size: 30px;
text-align: center;
}
.botonesegui{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  margin-left: 10%;
} */
 .formulariosegui {
  color: #333;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.inputsegui {
  width: 100%;
  height: 60px;
  margin: 10px 0;
  padding: 0 10px;
  /* border: 1px solid #4CAF50; */
  border-radius: 4px;
  font-size: 16px;
}

.titulosegui {
  color: #3f51b5;
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.botonesegui {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.tablalineas{
  border:2px solid black
}
</style>