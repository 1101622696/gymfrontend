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


async function guardar() {

agregar.value = false;
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
      // seguimientos:seguimientos.value,
    };
// console.log(seguimientos.value);
// console.log('este son seguimientos arriba');
console.log(nombre.value);
console.log(direccion.value);
console.log(fechaNacimiento.value);
console.log(telefono.value);
console.log(idPlan.value);
    let nombrez = await useCliente.postCliente(todo);

    if (nombrez.status === 200) {
      mostrarMensajeExito("Cliente agregado exitosamente");
      listarClientes();
      listarPlanes();
    } else {
      mostrarMensajeError("No se pudo agregar el cliente");
    }
  }
}
function editar(info){
    agregar.value = true;
    botoneditar.value = false;

informacion.value=info

nombre.value.valor=informacion.value
documento.value.valor=informacion.value
direccion.value.valor=informacion.value
fechaNacimiento.value.valor=informacion.value
telefono.value.valor=informacion.value
observaciones.value.valor=informacion.value
idPlan.value.valor=informacion.value
foto.value.valor=informacion.value

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

    let nombrez = await useCliente.putCliente(informacion.value._id, todo);
    if (nombrez.status === 200) {
      mostrarMensajeExito("Cliente actualizado exitosamente");
      listarClientes();
      listarPlanes();
    } else {
      mostrarMensajeError("No se pudo actualizar el cliente");
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

  // for (let i = 0; i < seguimientos.value.length; i++) {
  //   const seguimiento = seguimientos.value[i];
  //   if (seguimiento.fecha === "") {
  //     mostrarMensajeError(`La fecha del seguimiento ${i + 1} está vacía`);
  //     verificado = false;
  //   }
  //   if (isNaN(seguimiento.peso) || seguimiento.peso <= 0) {
  //     mostrarMensajeError(`El peso del seguimiento ${i + 1} debe ser un número válido`);
  //     verificado = false;
  //   }
  //   if (isNaN(seguimiento.imc) || seguimiento.imc <= 0) {
  //     mostrarMensajeError(`El imc del seguimiento ${i + 1} debe ser un número válido`);
  //     verificado = false;
  //   }
  //   if (isNaN(seguimiento.brazo) || seguimiento.brazo <= 0) {
  //     mostrarMensajeError(`El brazo del seguimiento ${i + 1} debe ser un número válido`);
  //     verificado = false;
  //   }
  //   if (isNaN(seguimiento.altura) || seguimiento.altura <= 0) {
  //     mostrarMensajeError(`La altura del seguimiento ${i + 1} debe ser un número válido`);
  //     verificado = false;
  //   }
  //   if (isNaN(seguimiento.edad) || seguimiento.edad <= 0) {
  //     mostrarMensajeError(`La edad del seguimiento ${i + 1} debe ser un número válido`);
  //     verificado = false;
  //   }
  // }

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
    const res = await useCliente.listarClientesporCumpleanos(diacumple.value, mescumple.value);
    rows.value = res.clientes.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
  } catch (error) {
    console.error("Error al buscar clientes por cumpleaños:", error);
  }
};
function ejecutarlistcumple() {
if (diacumple.value < 1 || diacumple.value >31){
  mostrarMensajeError("ingrese un dia valido")
}
if (mescumple.value < 1 || mescumple.value >12){
  mostrarMensajeError("ingrese un mes valido")
}else{
  buscarClientesporCumpleanos()
}
}


function getPlanCodigo(id) {
  const plan = planesTodo.value.find(plan => plan._id === id);
  return plan ? `${plan.codigo} - ${plan.descripcion}` : '';
}

  onMounted(()=>{
  listarClientes(), listarPlanes()
})

const organizarPlanes = computed(() => {
    nombreCodigo.value = planesTodo.value.map((element) => ({
        label: `${element.codigo} - ${element.descripcion}`,
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




    const formateDate = (date) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    };
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
      let  clienteSeleccionado=ref(null);

    const toggleSegui = () => {
      segui.value = !segui.value;
      seguimientoModalOpen.value = false;
    };

    const closeModal = () => {
      seguimientoModalOpen.value = false;
      segui.value = false; // Asegurarse de que el formulario esté oculto al cerrar el modal
    };

    const openSeguimientoModal = (cliente) => {
      console.log("Cliente seleccionado:", cliente); // Log para verificar el cliente seleccionado
      selectedCliente.value = cliente;
      seguimientoModalOpen.value = true;
      segui.value = true; // Asegurarse de que el formulario esté oculto al abrir el modal
    };

      let seguimientos = ref([{
            fecha: '',
            peso: '',
            // imc: '',
            brazo: '',
            altura: '',
            edad: ''
          }])
          
    const seguimientoColumns = ref([
      { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' },
      { name: 'peso', label: 'Peso', field: 'peso', align: 'center' },
      { name: 'imc', label: 'IMC', field: 'imc', align: 'center' },
      { name: 'brazo', label: 'Brazo', field: 'brazo', align: 'center' },
      { name: 'altura', label: 'altura', field: 'altura', align: 'center' },
      { name: 'edad', label: 'Edad', field: 'edad', align: 'center' }
    ]);


    const actualizarSegui = async () => {
      console.log("Cliente seleccionado en actualizarSegui:", selectedCliente.value); 
      if (await validarSeguimiento(seguimientos.value[0])) {
        if (selectedCliente.value && selectedCliente.value._id) {
          console.log("Actualizando seguimiento para el cliente con ID:", selectedCliente.value._id); 
          await useCliente.putClienteSeguimiento(selectedCliente.value._id); 
          mostrarMensajeExito("Seguimiento agregado exitosamente");
          listarClientes();
          toggleSegui(); 
        } else {
          console.error("Error: Cliente no seleccionado correctamente");
          mostrarMensajeError("Cliente no seleccionado correctamente");
        }
      }
    };


    const validarSeguimiento = async (seguimiento) => {
      let verificado = true;
      if (!seguimiento.fecha) {
        mostrarMensajeError("La fecha del seguimiento está vacía");
        verificado = false;
      }
      if (isNaN(seguimiento.peso) || seguimiento.peso <= 0) {
        mostrarMensajeError("El peso del seguimiento debe ser un número válido");
        verificado = false;
      }
      if (isNaN(seguimiento.imc) || seguimiento.imc <= 0) {
        mostrarMensajeError("El IMC del seguimiento debe ser un número válido");
        verificado = false;
      }
      if (isNaN(seguimiento.brazo) || seguimiento.brazo <= 0) {
        mostrarMensajeError("El brazo del seguimiento debe ser un número válido");
        verificado = false;
      }
      if (isNaN(seguimiento.altura) || seguimiento.altura <= 0) {
        mostrarMensajeError("La altura del seguimiento debe ser un número válido");
        verificado = false;
      }
      if (isNaN(seguimiento.edad) || seguimiento.edad <= 0) {
        mostrarMensajeError("La edad del seguimiento debe ser un número válido");
        verificado = false;
      }
      return verificado;
    };
  

      const tooltipContent = ref('');
 const showTooltip = (text) => {
      tooltipContent.value = text;
      const tooltip = this.$refs.tooltip;
      tooltip && tooltip.show();
    };

    const hideTooltip = () => {
      const tooltip = this.$refs.tooltip;
      tooltip && tooltip.hide();
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

  

    <div class="tablaselect">

      <div class="inputlistarn" v-if="listN">
      <input class="inputn" type="text" placeholder="Digite nombre" v-model.trim="listNombre" />
      <button class="button"  id="buttonf" @click="ejecutarlistnombre()" style="margin-left: auto; margin-right: auto; display: block;">Buscar</button>
    </div>



      <div class="inputlistar" v-if="listP">
      <select v-model="planSeleccionado" @change="buscarClientesporPlan" class="custom-select2">
        <option disabled value="">Seleccione una opción</option>
        <option v-for="plan in planesTodo" :key="plan.id" :value="plan._id">{{ plan.descripcion }}</option>
      </select>
    </div>

   
    <div class="inputlistarcumple" v-if="listF">
      <input class="inputc" type="number" placeholder="Digite día" v-model.trim="diacumple" min="1" max="31" required />
      <input class="inputc" type="number" placeholder="Digite mes" v-model.trim="mescumple" min="1" max="12" required />
    
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
        <q-td :props="props">
          <p>{{ getPlanCodigo(props.row.idPlan) }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-fechaNacimiento="props">
        <q-td :props="props">
          <p>{{ formatDate(props.row.fechaNacimiento) }}</p>
        </q-td>
      </template>

    <template v-slot:body-cell-observaciones="props">
      <q-td :props="props">
        <span class="truncated-text">
          {{ props.row.observaciones }}
          <q-tooltip anchor="bottom middle" self="top middle" :content="props.row.observaciones" transition-show="scale" transition-hide="scale">
            <span class="truncated-text">{{ props.row.observaciones }}</span>
          </q-tooltip>
        </span>
      </q-td>
    </template>

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
            <q-tooltip v-model="showing">Edita</q-tooltip>
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
      <q-td :props="props">
        <q-btn class="segui" @click="openSeguimientoModal(props.row)">
          Seguimiento
            <q-tooltip v-model="showing">mira el seguimiento</q-tooltip>
        </q-btn>
      </q-td>
    </template>
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-btn v-if="props.row.estado == 1"  style="color:green">Activo</q-btn>
          <q-btn v-else  style="color:red">Inactivo</q-btn>
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
          <div class="agregarseguimiento">
            <q-btn class="agregaedita" @click="toggleSegui">✏️</q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

<!-- <q-dialog v-model="seguimientoModalOpen" persistent>
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
          <q-btn flat label="Cerrar" color="primary" @click="closeModal" />
          <div class="agregarseguimiento">
            <q-btn class="agregaedita" @click="toggleSegui">✏️</q-btn>
          </div>
        </q-card-actions> -->

        <div v-if="segui" class="segui-modal">
          <div class="segui-modal-contenedor">
            <div v-for="(seguimiento, index) in seguimientos" :key="index">
              <h4>Seguimiento</h4>
              <input class="input" type="date" placeholder="Formato: DD/MM/YYYY" v-model="seguimiento.fecha" />
              <input class="input" type="number" placeholder="Peso" v-model.number="seguimiento.peso" />
              <input class="input" type="number" placeholder="Brazo" v-model.number="seguimiento.brazo" />
              <input class="input" type="number" placeholder="altura (cm)" v-model.number="seguimiento.altura" />
              <input class="input" type="number" placeholder="Edad" v-model.number="seguimiento.edad" />
            </div>
            <q-btn class="agregaedita" @click="actualizarSegui">
              Actualizar Seguimiento
            </q-btn>
            <q-btn color="primary" @click="toggleSegui" class="segui-modal-cerrar">
              X
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>



<!-- este medio sirve -->

<!-- <div v-if="segui" class="segui-modal">
      <div class="segui-modal-contenedor">
        <div v-for="(seguimiento, index) in seguimientos" :key="index">
          <h4>Seguimiento {{ index + 1 }}</h4>
          <input class="input" type="date" placeholder="Formato: DD/MM/YYYY" v-model="seguimiento.fecha" />
          <input class="input" type="number" placeholder="Peso" v-model.number="seguimiento.peso" />
          <input class="input" type="number" placeholder="IMC" v-model.number="seguimiento.imc" />
          <input class="input" type="number" placeholder="Brazo" v-model.number="seguimiento.brazo" />
          <input class="input" type="number" placeholder="altura" v-model.number="seguimiento.altura" />
          <input class="input" type="number" placeholder="Edad" v-model.number="seguimiento.edad" />
        </div>
        <q-btn class="agregaedita" @click="actualizarSegui">
          Actualizar Seguimiento
        </q-btn>
        <q-btn color="primary" @click="toggleSegui" class="segui-modal-cerrar">
          X
        </q-btn>
      </div>
    </div> -->

    <div class="crearcliente" v-if="agregar">
      <div class="encabezadoCrear">
        <h3>Ingresar Clientes</h3>
        <button class="buttonX" @click="cerrar()">X</button>
      </div>
      <div class="inputs">
        <input class="input" type="text" placeholder="Nombre" v-model.trim="nombre" />
        <input class="input" type="text" placeholder="N° Documento" v-model.trim="documento" />
        <input class="input" type="text" placeholder="Dirección" v-model.trim="direccion" />
        <!-- <input class="input" type="textarea" placeholder="Observaciones" v-model.trim="observaciones" /> -->
            <textarea class="input textarea" placeholder="Observaciones" v-model.trim="observaciones"></textarea>
        <input class="input" type="date" placeholder="Fecha de Nacimiento" v-model.trim="fechaNacimiento" />
        <input class="input" type="text" placeholder="Teléfono" v-model.trim="telefono" />
        <q-select standout v-model="idPlan" :options="organizarPlanes" option-value="valor" option-label="label" label="Plan" style="background-color: #grey; margin-bottom: 20px" />
        <input class="input" type="text" placeholder="Foto" v-model.trim="foto" />
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
</style>
