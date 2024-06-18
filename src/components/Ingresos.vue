<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from 'quasar'
import { useStoreIngresos } from "../store/ingresos.js";

const useIngreso = useStoreIngresos();
let alert = ref(false)
let accion = ref(1)
let rows=ref([])
const $q = useQuasar();


function abrir(){
  accion.value=1
    alert.value = true;

idSede.value=""
idCliente.value=""
}


async function guardar() {
  alert.value = false;

      if (await validar()) {
        const todo = {
          idSede: idSede.value.valor,
          idCliente: idCliente.value.valor,
      };
      console.log(`${idCliente.value.valor} es el id de cliente`);
      console.log(`${idSede.value.valor} es el id de sede`);
      console.log(`${nombreCodigoC.value} es el  de cliente`);
      console.log(`${nombreCodigoS.value} es el  de sede`);



        let nombrez = await useIngreso.postIngresos(todo);
        if (nombrez.status !== 200) {
          mostrarMensajeError("No se pudo enviar");
        } else {
          mostrarMensajeExito("Muy bien");
          listarIngresos();
          listarClientes();
          listarSedes();
        }
      }
    }

    function editar(info) {
          alert.value = true;
    accion.value !=1;
      informacion.value = info;
      idSede.value.valor = informacion.value;
      idCliente.value.valor = informacion.value;
    }

    async function editaringreso() {
      if (await validar()) {
        const todo = {
          idSede: idSede.value.valor,
          idCliente: idCliente.value.valor,
        };
        let nombrez = await useIngreso.putIngresos(informacion.value._id, todo);
        if (nombrez.status !== 200) {
          mostrarMensajeError("No se pudo enviar");
        } else {
          mostrarMensajeExito("Muy bien");
          listarIngresos();
        }
      }
    }
let informacion=ref("")

let idSede = ref("");
let idCliente = ref("");
let fecha = ref("");
let sedesTodo = ref([]);
let clientesTodo = ref([]);
let nombreCodigoS = ref([]);
let nombreCodigoC = ref([]);


let columns =ref([
      {name:"idSede", label:"Sede", field:"idSede", align:"center"},
    {name:"idCliente", sortable:true, label:" Cliente", field:"idCliente", align:"center",},
    {name:"fecha", label:"Fecha del ingreso", field:"fecha", align:"center"},
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },

])



async function validar() {
    let verificado = true;

    // if (fecha.value === "") {
    //     mostrarMensajeError("ingrese una fecha");
    //     verificado = false;
    // }
    if (idSede.value === "") {
        mostrarMensajeError("seleccione una sede");
        verificado = false;
    }
    if (idCliente.value === "") {
        mostrarMensajeError("seleccione un cliente");
        verificado = false;
    }

    if (verificado) {
        mostrarMensajeExito("El formulario se envió correctamente");
    }

    console.log(idCliente.value);
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


function cerrar() {
    alert.value = false;
}     


      onMounted(()=>{
  listarIngresos(), listarClientes(), listarSedes();
})

import { useStoreSedes } from "../store/sedes.js";
const useSedes = useStoreSedes();


import { useStoreClientes } from "../store/clientes.js";
const useCliente = useStoreClientes();

async function listarIngresos() {
  try {
    const res = await useIngreso.listarIngreso();
    console.log("Ingresos:", res.data);
    rows.value = res.data.ingreso;
  } catch (error) {
    console.error("Error al listar ingresos:", error);
  }
}
const organizarClientes = computed(() => {
    nombreCodigoC.value = clientesTodo.value.map((element) => ({
        label: `${element.nombre}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigoC.value;
});
async function listarClientes() {
    try {
    const res = await useCliente.listarCliente()
       clientesTodo.value = res.data.cliente;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}

const organizarSedes = computed(() => {
    nombreCodigoS.value = sedesTodo.value.map((element) => ({
        label: `${element.nombre}`,
        valor: `${element._id}`,
        nombre: `${element.nombre}`,
    }));
    return nombreCodigoS.value;
});

async function listarSedes() {
    try {
    const res = await useSedes.listarSede()
       sedesTodo.value = res.data.sede;
    } catch (error) {
        console.error("Error al listar planes:", error);
    }
}

function getSedeNombre(id) {
  const sede = sedesTodo.value.find((sede) => sede._id === id);
  return sede ? sede.nombre : "Dirección no encontrada";
}
function getClienteNombre(id) {
  const cliente = clientesTodo.value.find((cliente) => cliente._id === id);
  return cliente ? cliente.nombre : "Documento no encontrado";
}


   const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    };


</script>

<template>
  <div>
    <q-table class="table" flat bordered title="Ingresos" :rows="rows" :columns="columns" row-key="id">
      <template v-slot:body-cell-idSede="props">
        <q-td :props="props">
          <p>{{ getSedeNombre(props.row.idSede) }}</p>
        </q-td>
      </template>
      <template v-slot:body-cell-idCliente="props">
        <q-td :props="props">
          <p>{{ getClienteNombre(props.row.idCliente) }}</p>
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
          </q-td>
        </template>
    </q-table>

    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Ingreso</q-btn>
    </div>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Ingreso" : "Editar Ingreso" }}
            </div>
          </q-card-section>
          <!-- esta no se descomenta 
          <q-input outlined v-model="fecha" use-input hide-selected fill-input input-debounce="0" class="q-my-md q-mx-md" label="fecha del ingreso" type="date" /> -->

          <q-select standout v-model="idSede" :options="organizarSedes" option-value="valor" option-label="label" label="Sede" style="background-color: #grey; margin-bottom: 20px" />
          <q-select standout v-model="idCliente" :options="organizarClientes" option-value="valor" option-label="label" label="Cliente" style="background-color: #grey; margin-bottom: 20px" />

          <q-card-actions align="right">
            <q-btn @click="guardar()" v-if="accion === 1" color="red" class="text-white" :loading="useIngreso.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn @click="editaringreso()" v-if="accion !== 1" color="red" class="text-white" :loading="useIngreso.loading">Editar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>


<style scoped>

</style>